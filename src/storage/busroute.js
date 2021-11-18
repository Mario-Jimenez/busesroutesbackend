const { StorageError } = require('./errors');

class BusRouteStorage {
  constructor(db) {
    this.db = db;
  }

  async findShortestRoute(departureStop, arrivalStop) {
    const findShortestRouteQuery = {
      text: `SELECT 'FeatureCollection' AS "type", jsonb_agg(feature) AS "features"
      FROM (
        SELECT jsonb_build_object(
          'type',       'Feature',
          'geometry',   ST_AsGeoJSON(ST_Transform(geom,4326))::jsonb
        ) AS feature
        FROM (
          SELECT r.geom
          FROM pgr_dijkstra(
            'SELECT id, source, target, distancia as cost FROM routes_primary_final',
            $1::BIGINT, $2::BIGINT, directed => false) d
          INNER JOIN routes_primary_final r
            ON (d.edge=r.id)) row
      ) features;`,
      values: [departureStop, arrivalStop],
    };

    try {
      const { rows } = await this.db.query(findShortestRouteQuery);
      return rows[0];
    } catch (err) {
      throw new StorageError(err.message);
    }
  }

  async findSubRoutes(departureStop, arrivalStop) {
    const findBusesRoutesQuery = {
      text: `SELECT br.id, br.description, (SUM(rp.distancia)/1000)::BIGINT AS kilometers, (
              SELECT jsonb_build_object(
                'type',     'FeatureCollection',
                'features', jsonb_agg(feature)
              )
              FROM (
                SELECT jsonb_build_object(
                  'type',       'Feature',
                  'geometry',   ST_AsGeoJSON(ST_Transform(geom,4326))::jsonb
                ) AS feature
                FROM bus_route_road brr
                  INNER JOIN routes_primary_final rp
                  ON brr.road_id = rp.id
                WHERE brr.bus_route_id = br.id
              ) features
            ) AS feature_collection
            FROM (
              SELECT DISTINCT br.id, br.description
              FROM (SELECT r.id, r.geom FROM pgr_dijkstra(
                'SELECT id, source, target, distancia as cost FROM routes_primary_final',
                $1::BIGINT, $2::BIGINT, directed => false) d
                INNER JOIN routes_primary_final r
                  ON (d.edge=r.id)) dr
                INNER JOIN bus_route_road brr
                ON dr.id = brr.road_id
                INNER JOIN bus_route br
                ON brr.bus_route_id = br.id
              ) br
              INNER JOIN 	bus_route_road brr
              ON br.id = brr.bus_route_id
              INNER JOIN routes_primary_final rp
              ON brr.road_id = rp.id
            GROUP BY br.id, br.description;`,
      values: [departureStop, arrivalStop],
    };

    try {
      const { rows } = await this.db.query(findBusesRoutesQuery);
      return rows;
    } catch (err) {
      throw new StorageError(err.message);
    }
  }
}

module.exports = BusRouteStorage;

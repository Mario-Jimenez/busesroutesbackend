const { StorageError } = require('./errors');

class BusStopStorage {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const findAllQuery = {
      text: `SELECT 'FeatureCollection' AS "type", jsonb_agg(feature) AS "features"
      FROM (
        SELECT jsonb_build_object(
          'id',           vertex_id,
          'type',         'Feature',
          'geometry',     ST_AsGeoJSON(ST_Transform(geom,4326))::jsonb,
          'properties',   to_jsonb(row) - 'id' - 'vertex_id' - 'geom'
        ) AS feature
        FROM (SELECT * FROM bus_stop) row
      ) features;`,
    };

    try {
      const { rows } = await this.db.query(findAllQuery);
      return rows[0];
    } catch (err) {
      throw new StorageError(err.message);
    }
  }
}

module.exports = BusStopStorage;

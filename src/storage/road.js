const { StorageError } = require('./errors');

class RoadStorage {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const findAllQuery = {
      text: `SELECT 'FeatureCollection' AS "type", jsonb_agg(feature) AS "features"
      FROM (
        SELECT jsonb_build_object(
          'id',         id,
          'type',       'Feature',
          'geometry',   ST_AsGeoJSON(ST_Transform(geom,4326))::jsonb
        ) AS feature
        FROM (SELECT * FROM routes_primary_final) row
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

module.exports = RoadStorage;

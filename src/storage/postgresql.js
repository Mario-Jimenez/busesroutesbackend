const { Pool } = require('pg');

class PostgreSQLDatabase {
  constructor(config, eventEmitter) {
    this.pool = new Pool(config);
    this.eventEmitter = eventEmitter;

    // eslint-disable-next-line no-unused-vars
    this.pool.on('error', (err, _client) => {
      // TODO: listen for this event
      this.eventEmitter.emit('postgresqlErrors', err);
    });
  }

  connection() {
    return this.pool;
  }

  async close() {
    await this.pool.end();
  }
}

/* const config = {
  // maximum number of clients the pool should contain
  // by default this is set to 10.
  max: 20,
  // number of milliseconds a client must sit idle in the pool and not be checked out
  // before it is disconnected from the backend and discarded
  // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
  idleTimeoutMillis: 30000,
  // number of milliseconds to wait before timing out when connecting a new client
  // by default this is 0 which means no timeout
  connectionTimeoutMillis: 5000,
}; */

module.exports = PostgreSQLDatabase;

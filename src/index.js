const { EventEmitter } = require('events');
const { getLogger } = require('./logger/log');
const PostgreSQLDatabase = require('./storage/postgresql');

const main = () => {
  const databaseConfig = {
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
  };

  const appEventEmitter = new EventEmitter();
  const log = getLogger();
  const postgresqlDatabase = new PostgreSQLDatabase(
    databaseConfig,
    appEventEmitter
  );

  appEventEmitter.on('postgresqlErrors', (err) => {
    log.error(
      {
        err,
      },
      'PostgreSQL error'
    );
  });

  postgresqlDatabase.close();
};

main();

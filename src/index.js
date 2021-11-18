require('dotenv').config();
const { EventEmitter } = require('events');
const ExpressServer = require('./api/express');
const BusRouteController = require('./bus/route');
const BusStopController = require('./bus/stop');
const { getLogger, initializeLogger } = require('./logger/log');
const RoadController = require('./road/road');
const BusRouteStorage = require('./storage/busroute');
const BusStopStorage = require('./storage/busstop');
const PostgreSQLDatabase = require('./storage/postgresql');
const RoadStorage = require('./storage/road');

const main = async () => {
  await initializeLogger('buses-routes', '0.1.0');
  const log = getLogger();

  const databaseConfig = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
  const appEventEmitter = new EventEmitter();
  const postgresqlDatabase = new PostgreSQLDatabase(
    databaseConfig,
    appEventEmitter
  );

  const roadStorage = new RoadStorage(postgresqlDatabase.connection());
  const roadController = new RoadController({
    log,
    roadStorage,
  });

  const busStopStorage = new BusStopStorage(postgresqlDatabase.connection());
  const busStopController = new BusStopController({
    log,
    busStopStorage,
  });

  const busRouteStorage = new BusRouteStorage(postgresqlDatabase.connection());
  const busRouteController = new BusRouteController({
    log,
    busRouteStorage,
  });

  const config = {
    log,
    port: process.env.PORT,
    roadController,
    busStopController,
    busRouteController,
  };

  const server = new ExpressServer(config);

  appEventEmitter.on('postgresqlErrors', (err) => {
    log.error({ err }, 'PostgreSQL error');
  });

  process.on('SIGINT', async () => {
    await server.shutdown();
    await postgresqlDatabase.close();
    log.info('Process terminated');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.shutdown();
    await postgresqlDatabase.close();
    log.info('Process terminated');
    process.exit(0);
  });

  server.run();
};

main();

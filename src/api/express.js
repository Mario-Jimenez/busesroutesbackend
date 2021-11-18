const express = require('express');
const cors = require('cors');
const roadRouter = require('./road');
const busStopRouter = require('./busstop');
const busRouteRouter = require('./busroute');

class ExpressServer {
  constructor(config) {
    this.log = config.log;
    this.port = config.port;

    this.app = express();
    this.app.use(cors());
    this.app.use('/road', roadRouter(this.log, config.roadController));
    this.app.use(
      '/bus/stop',
      busStopRouter(this.log, config.busStopController)
    );
    this.app.use(
      '/bus/route',
      busRouteRouter(this.log, config.busRouteController)
    );
  }

  run() {
    this.server = this.app.listen(this.port, () => {
      this.log.info({ port: this.port }, 'Running server...');
    });
  }

  async shutdown() {
    this.server.close(() => {
      this.log.info('Server exiting');
    });
  }
}

module.exports = ExpressServer;

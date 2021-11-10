const express = require('express');
const roadRouter = require('./road');

class ExpressServer {
  constructor(config) {
    this.log = config.log;
    this.port = config.port;

    this.app = express();
    this.app.use('/road', roadRouter(this.log, config.roadController));
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

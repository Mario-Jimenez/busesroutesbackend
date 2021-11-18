class BusStopController {
  constructor(config) {
    this.log = config.log;
    this.busStopStorage = config.busStopStorage;
  }

  async findAllGeoJson() {
    const busStops = await this.busStopStorage.findAll();
    return busStops;
  }
}

module.exports = BusStopController;

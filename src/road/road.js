class RoadController {
  constructor(config) {
    this.log = config.log;
    this.roadStorage = config.roadStorage;
  }

  async findAllGeoJson() {
    const roads = await this.roadStorage.findAll();
    return roads;
  }
}

module.exports = RoadController;

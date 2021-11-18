class BusRouteController {
  constructor(config) {
    this.log = config.log;
    this.busRouteStorage = config.busRouteStorage;
  }

  async findShortestRouteGeoJson(departureStop, arrivalStop) {
    const shortestRoute = await this.busRouteStorage.findShortestRoute(
      departureStop,
      arrivalStop
    );
    return shortestRoute;
  }

  async findSubRoutesGeoJson(departureStop, arrivalStop) {
    const busesRoutes = await this.busRouteStorage.findSubRoutes(
      departureStop,
      arrivalStop
    );
    return busesRoutes;
  }
}

module.exports = BusRouteController;

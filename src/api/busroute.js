const express = require('express');

const busRouteRouter = (log, busRouteController) => {
  const router = express.Router();

  router.get('/shortest', async (req, res) => {
    const handlerLog = {
      url: req.originalUrl,
      httpVerb: req.method,
      departureStop: req.query.departureStop,
      arrivalStop: req.query.arrivalStop,
    };
    log.info(handlerLog, 'Incoming request');

    try {
      const shortestRoute = await busRouteController.findShortestRouteGeoJson(
        req.query.departureStop,
        req.query.arrivalStop
      );
      res.status(200).json(shortestRoute);
    } catch (err) {
      log.error({ ...handlerLog, err }, 'Unable to find shortest route');
      res.status(500).send('Unable to find shortest route');
    }
  });

  router.get('/routes', async (req, res) => {
    const handlerLog = {
      url: req.originalUrl,
      httpVerb: req.method,
      departureStop: req.query.departureStop,
      arrivalStop: req.query.arrivalStop,
    };
    log.info(handlerLog, 'Incoming request');

    try {
      const busesRoutes = await busRouteController.findSubRoutesGeoJson(
        req.query.departureStop,
        req.query.arrivalStop
      );
      res.status(200).json(busesRoutes);
    } catch (err) {
      log.error({ ...handlerLog, err }, 'Unable to find buses routes');
      res.status(500).send('Unable to find buses routes');
    }
  });

  return router;
};

module.exports = busRouteRouter;

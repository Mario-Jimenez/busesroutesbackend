const express = require('express');

const busStopRouter = (log, busStopController) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const handlerLog = {
      url: req.originalUrl,
      httpVerb: req.method,
    };
    log.info(handlerLog, 'Incoming request');

    try {
      const busStops = await busStopController.findAllGeoJson();
      res.status(200).json(busStops);
    } catch (err) {
      log.error({ ...handlerLog, err }, 'Unable to find bus stops');
      res.status(500).send('Unable to find bus stops');
    }
  });

  return router;
};

module.exports = busStopRouter;

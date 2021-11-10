const express = require('express');

const roadRouter = (log, roadController) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const handlerLog = {
      url: req.originalUrl,
      httpVerb: req.method,
    };
    log.info(handlerLog, 'Incoming request');

    try {
      const roads = await roadController.findAllGeoJson();
      res.status(200).json(roads);
    } catch (err) {
      log.error({ ...handlerLog, err }, 'Unable to find roads');
      res.status(500).send('Unable to find roads');
    }
  });

  return router;
};

module.exports = roadRouter;

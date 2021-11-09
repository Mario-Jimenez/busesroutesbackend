const bunyan = require('bunyan');
const LogzioBunyanStream = require('logzio-bunyan');

let log;
let logzioStream;

const initializeLogger = async (serviceName, serviceVersion) => {
  const loggerStreams = [
    {
      stream: process.stdout,
    },
  ];

  if (
    process.env.LOGZIO_TOKEN !== '' &&
    process.env.LOGZIO_TOKEN !== undefined
  ) {
    const loggerOptions = {
      token: process.env.LOGZIO_TOKEN,
      protocol: 'https',
      bufferSize: 20,
      sendIntervalMs: 10 * 1000,
    };

    logzioStream = new LogzioBunyanStream(loggerOptions);

    loggerStreams.push({
      type: 'raw',
      stream: logzioStream,
    });
  }

  log = bunyan.createLogger({
    name: 'nodejs',
    serviceName,
    serviceVersion,
    src: true,
    level: process.env.LOG_LEVEL.toLowerCase() || 'debug',
    serializers: { err: bunyan.stdSerializers.err },
    streams: loggerStreams,
  });
};

const getLogger = () => log;

const closeLogger = async () => {
  if (logzioStream !== undefined) {
    logzioStream.end();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

module.exports = {
  initializeLogger,
  getLogger,
  closeLogger,
};

import apm from 'elastic-apm-node';

apm.start({
  serviceName: process.env.APM_SERVICE_NAME ?? 'apollo-server',
  serverUrl: process.env.APM_SERVER_URL ?? 'http://apm-server:8200',
  environment: process.env.NODE_ENV ?? 'development',
  logLevel: 'info',
});

export default apm;

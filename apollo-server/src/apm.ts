import apm from 'elastic-apm-node';

apm.start({
  serviceName: 'apollo-server',
  serverUrl: 'http://apm-server:8200',
  environment: 'development',
  logLevel: 'info',
});

export default apm;

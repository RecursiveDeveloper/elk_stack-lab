import { createLogger, transports } from 'winston';
import { ecsFormat } from '@elastic/ecs-winston-format';

// ECS format attaches trace.id and transaction.id from the active APM
// transaction automatically, so logs correlate with APM traces in Kibana.
const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: ecsFormat({ convertReqRes: true }),
  transports: [new transports.Console()],
});

export default logger;

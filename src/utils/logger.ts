import { isProduction } from '@/config/index';

type TLogger = 'log' | 'error' | 'warn';

const logger = (title: string, msg?: any, type: TLogger = 'log'): void => {
  if (!isProduction) {
    console[type](`${title}\n${JSON.stringify(msg)}`);
  }
};

export default logger;
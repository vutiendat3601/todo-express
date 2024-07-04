import { error } from 'winston';
import 'reflect-metadata';
import express, {
  Request,
  Response,
  Express,
  NextFunction,
  Router,
} from 'express';
import configRoute from './config-route';
import handleAppError from '../middlewares/error-hanlder';
import configDatasource from './config-datasource';
import logger from '../utils/logger';

// const router = Router();

export default function initApp(app: Express, port?: number) {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  configRoute(app);

  app.use(handleAppError);
  configDatasource();

  const PORT = port || process.env.PORT || 3000;
  return function startApp() {
    return app.listen(PORT, () => {
      logger.info(`Server is running on ${PORT}`);
    });
  };
}

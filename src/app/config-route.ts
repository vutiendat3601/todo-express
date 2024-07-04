import { Express } from 'express';
import taskRouter from '../domain/task/task.route';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('../resources/openapi.json');

export default function configRoute(app: Express): void {
  app.use('/v1/tasks', taskRouter);
  app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

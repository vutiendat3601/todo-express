import { DataSource } from 'typeorm';
import { Task } from '../domain/task/entity/task.entity';
import logger from '../utils/logger';

export const sqlLiteDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  logging: true,
  entities: [Task],
  subscribers: [],
  migrations: [],
});
function configDatasource() {
  sqlLiteDataSource
    .initialize()
    .then(() => logger.info('SQLite database connected'))
    .catch((err) => logger.error(err));
}

export default configDatasource;

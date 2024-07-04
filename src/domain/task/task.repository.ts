import { sqlLiteDataSource } from '../../app/config-datasource';
import { Task } from './entity/task.entity';

export default sqlLiteDataSource.getRepository(Task);

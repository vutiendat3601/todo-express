import { TaskDto } from './dto/task.dto';
import { Task } from './entity/task.entity';

export function mapToTaskDto(task: Task): TaskDto {
  const { id, name, startDate, endDate } = task;
  return {
    id,
    name,
    startDate,
    endDate,
  };
}

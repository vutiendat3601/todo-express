import { BAD_REQUEST_STATUS } from '../../common/constant';
import AppError from '../../common/type/Error';
import Pagination from '../../common/type/Pagination.type';
import { TaskDto } from './dto/task.dto';
import { Task } from './entity/task.entity';
import {
  TASK_BR_01_MESSAGE,
  TASK_BR_02_MESSAGE,
  TASK_NOT_FOUND_MESSAGE,
  TASK_NOT_FOUND_STATUS,
} from './task.constant';
import { mapToTaskDto } from './task.mapper';
import taskRepo from './task.repository';

class TaskService {
  async createOrUpdateTask(
    name: string,
    startDate: string,
    endDate: string,
    id?: number
  ): Promise<number> {
    let task: Task = new Task();
    if (id || id === 0) {
      const exsitedTask = await taskRepo.findOne({ where: { id } });
      if (!exsitedTask) {
        throw new AppError(TASK_NOT_FOUND_STATUS, TASK_NOT_FOUND_MESSAGE);
      }
      task = exsitedTask;
    }

    task.name = name;
    // Check the startDate and endDate
    if (startDate) {
      task.startDate = startDate;
      if (endDate) {
        const endDateObj = new Date(endDate);
        const startDateObj = new Date(startDate);
        if (startDateObj > endDateObj) {
          // The field 'startDate' should be less than or equals to the field 'endDate'
          throw new AppError(BAD_REQUEST_STATUS, TASK_BR_01_MESSAGE);
        }
        task.endDate = endDate;
      }
    } else if (endDate) {
      throw new AppError(BAD_REQUEST_STATUS, TASK_BR_02_MESSAGE);
    }
    await taskRepo.save(task);
    return task.id;
  }

  async getTask(id: number): Promise<TaskDto> {
    const task = await taskRepo.findOne({ where: { id } });
    if (!task) {
      throw new AppError(TASK_NOT_FOUND_STATUS, TASK_NOT_FOUND_MESSAGE);
    }
    return mapToTaskDto(task);
  }

  async getTasks(
    page: number,
    size: number,
    sort = {}
  ): Promise<Pagination<TaskDto>> {
    const totalItems = await taskRepo.count();
    const totalPages = Math.ceil(totalItems / size);
    const [itemEntities] = await taskRepo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: sort,
    });
    const items = itemEntities.map(mapToTaskDto);
    return { items, page, size, totalItems, totalPages };
  }
  async patchTask(
    id: number,
    name: string | null,
    startDate: string | null,
    endDate: string | null
  ) {
    const task = await taskRepo.findOne({ where: { id } });
    if (!task) {
      throw new AppError(TASK_NOT_FOUND_STATUS, TASK_NOT_FOUND_MESSAGE);
    }
    if (!name && !startDate && !endDate) {
      return;
    }
    if (name) {
      task.name = name;
    }
    startDate = startDate ? startDate : task.startDate;
    endDate = endDate ? endDate : task.endDate;

    // Check the startDate and endDate
    if (startDate) {
      task.startDate = startDate;
      if (endDate) {
        const endDateObj = new Date(endDate);
        const startDateObj = new Date(startDate);
        if (startDateObj > endDateObj) {
          // The field 'startDate' should be less than or equals to the field 'endDate'
          throw new AppError(BAD_REQUEST_STATUS, TASK_BR_01_MESSAGE);
        }
        task.endDate = endDate;
      }
    } else if (endDate) {
      throw new AppError(BAD_REQUEST_STATUS, TASK_BR_02_MESSAGE);
    }
    await taskRepo.save(task);
  }
  async deleteTask(id: number) {
    const task = await taskRepo.findOne({ where: { id } });
    if (!task) {
      throw new AppError(TASK_NOT_FOUND_STATUS, TASK_NOT_FOUND_MESSAGE);
    }
    await taskRepo.delete({ id });
  }
}

export default new TaskService();

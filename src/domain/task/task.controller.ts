import { NextFunction, Request, Response } from 'express';
import logger from '../../utils/logger';
import parseSorter from '../../utils/sort-parser';
import { TaskDto } from './dto/task.dto';
import {
  TASK_CREATED_SUCCESS_MESSAGE,
  TASK_CREATED_SUCCESS_STATUS,
  TASK_DELETED_SUCCESS_MESSAGE,
  TASK_DELETED_SUCCESS_STATUS,
  TASK_UPDATED_SUCCESS_MESSAGE,
  TASK_UPDATED_SUCCESS_STATUS,
} from './task.constant';
import taskService from './task.service';

class TaskController {
  // POST /v1/tasks
  async createOrUpdateTask(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info(`CREATE Task: body=${JSON.stringify(req.body)}`);
      const { id, name, startDate, endDate } = req.body;
      if (id || id === 0) {
        await taskService.createOrUpdateTask(
          name,
          startDate,
          endDate,
          Number(id)
        );
        res.status(TASK_UPDATED_SUCCESS_STATUS).json({
          status: TASK_UPDATED_SUCCESS_STATUS,
          message: TASK_UPDATED_SUCCESS_MESSAGE,
        });
      } else {
        const newId = await taskService.createOrUpdateTask(
          name,
          startDate,
          endDate
        );
        res
          .location(`/v1/tasks/${newId}`)
          .status(TASK_CREATED_SUCCESS_STATUS)
          .json({
            status: TASK_CREATED_SUCCESS_STATUS,
            message: TASK_CREATED_SUCCESS_MESSAGE,
          });
      }
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/tasks
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.query);
      const { page = 1, size = 10 } = req.query;
      const sortQuery = req.query.sort as string;
      const sort = parseSorter(sortQuery);
      const result = await taskService.getTasks(
        Number(page),
        Number(size),
        sort
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/tasks/{id}
  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.info(`GET Task: id=${id}`);
      const taskDto: TaskDto = await taskService.getTask(Number(id));
      res.json(taskDto);
    } catch (error) {
      next(error);
    }
  }

  // PATCH /v1/tasks/{id}
  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, startDate, endDate } = req.body;
      await taskService.patchTask(Number(id), name, startDate, endDate);
      res.status(TASK_UPDATED_SUCCESS_STATUS).json({
        message: TASK_UPDATED_SUCCESS_MESSAGE,
        status: TASK_UPDATED_SUCCESS_STATUS,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /v1/tasks/{id}
  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.info(`DELETE Task: id=${id}`);
      await taskService.deleteTask(Number(id));
      res.status(TASK_DELETED_SUCCESS_STATUS).json({
        message: TASK_DELETED_SUCCESS_MESSAGE,
        status: TASK_DELETED_SUCCESS_STATUS,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();

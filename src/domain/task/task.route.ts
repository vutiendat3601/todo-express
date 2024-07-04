import { Router } from 'express';
import { param } from 'express-validator';
import { paginationValidators } from '../../common/validator/pagination-validator';
import createSortValidators from '../../common/validator/sort-validator';
import validationHandler from '../../middlewares/validation-handler';
import taskController from './task.controller';
import {
  createTaskValidators,
  deleteTaskValidators,
  getTaskValidators,
  updateTaskValidators,
} from './task.validator';
const router = Router();

router.get(
  '/',
  paginationValidators,
  createSortValidators(['name', 'startDate', 'endDate']),
  validationHandler,
  taskController.getTasks
);

router.get(
  '/:id',
  getTaskValidators,
  validationHandler,
  taskController.getTask
);

router.post(
  '/',
  createTaskValidators,
  validationHandler,
  taskController.createOrUpdateTask
);

router.patch(
  '/:id',
  updateTaskValidators,
  validationHandler,
  taskController.updateTask
);

router.delete(
  '/:id',
  deleteTaskValidators,
  validationHandler,
  taskController.deleteTask
);

export default router;

import { body, param } from 'express-validator';
import { isValidDate } from '../../utils/validator';

const NAME_CONSTRAINT = `The field 'name' must not be blank and less than or equals to 80 characters`;
const START_DATE_CONSTRAINT = `The field 'startDate' must match the pattern 'YYYY-MM-DD' and must be a valid date`;
const END_DATE_CONSTRAINT = `The field 'endDate' must match the pattern 'YYYY-MM-DD' and must be a valid date`;
const ID_CONSTRAINT = `The field 'id' must be an integer`;

export const createTaskValidators = [
  body('id', ID_CONSTRAINT).optional({ values: 'null' }).isInt(),
  body('name', NAME_CONSTRAINT)
    .escape()
    .custom((value: string) => value.trim().length > 0)
    .isLength({ max: 80 }),
  body('startDate', START_DATE_CONSTRAINT)
    .optional({ values: 'null' })
    .custom((dateStr) => isValidDate(dateStr, 'YYYY-MM-DD')),
  body('endDate', END_DATE_CONSTRAINT)
    .optional({ values: 'null' })
    .notEmpty()
    .custom((dateStr) => isValidDate(dateStr, 'YYYY-MM-DD')),
];

export const deleteTaskValidators = [param('id', ID_CONSTRAINT).isInt()];

export const updateTaskValidators = [
  param('id', ID_CONSTRAINT).isInt(),
  body('name', NAME_CONSTRAINT)
    .optional({ values: 'null' })
    .escape()
    .custom((value: string) => value.trim().length > 0)
    .isLength({ max: 80 }),
  body('startDate', START_DATE_CONSTRAINT)
    .optional({ values: 'null' })
    .custom((dateStr) => isValidDate(dateStr, 'YYYY-MM-DD')),
  body('endDate', END_DATE_CONSTRAINT)
    .optional({ values: 'null' })
    .notEmpty()
    .custom((dateStr) => isValidDate(dateStr, 'YYYY-MM-DD')),
];

export const getTaskValidators = [param('id', ID_CONSTRAINT).isInt()];

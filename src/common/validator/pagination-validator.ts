import { query } from 'express-validator';

// const MAX_PAGE_INDEX = 1000;
const MAX_PAGE_SIZE = 100;

export const paginationValidators = [
  query('page', `The field 'page' must be an integer and greater than 0`)
    .optional()
    .default(1)
    .isInt({ min: 1 })
    .customSanitizer((value) => {
      if (value instanceof Array) {
        return value[0];
      }
      return value;
    }),
  query(
    'size',
    `The field 'size' must be an integer and in range [1, ${MAX_PAGE_SIZE}]`
  )
    .optional()
    .default(10)
    .isInt({ min: 1, max: MAX_PAGE_SIZE })
    .customSanitizer((value) => {
      if (value instanceof Array) {
        return value[0];
      }
      return value;
    }),
];

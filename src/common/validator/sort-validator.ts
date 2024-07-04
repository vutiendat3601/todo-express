import { query } from 'express-validator';

// const MAX_PAGE_INDEX = 1000;
const MAX_PAGE_SIZE = 100;

const SORT_ORDERS = ['asc', 'desc'];

function createSortValidators(fields: string[]) {
  return [
    query(
      'sort',
      `The field 'sort' must be an array and every item must match the pattern '[${fields.join(
        '|'
      )}]:[asc|desc]'`
    )
      .optional()
      .custom((sortParam: string) => {
        const sorts = sortParam.split(',');
        for (const sort of sorts) {
          if (sort) {
            const [field, order] = sort.split(':');
            if (!fields.includes(field) || !SORT_ORDERS.includes(order)) {
              return false;
            }
          }
        }
        return true;
      }),
  ];
}

export default createSortValidators;

export const TASK_CREATED_SUCCESS_MESSAGE = 'Created task successfully';
export const TASK_CREATED_SUCCESS_STATUS = 201;

export const TASK_UPDATED_SUCCESS_MESSAGE = 'Updated task successfully';
export const TASK_UPDATED_SUCCESS_STATUS = 200;

export const TASK_DELETED_SUCCESS_MESSAGE = 'Deleted task successfully';
export const TASK_DELETED_SUCCESS_STATUS = 200;

export const TASK_NOT_FOUND_STATUS = 404;
export const TASK_NOT_FOUND_MESSAGE = 'Task not found';

// Bussiness rule
export const TASK_BR_01_MESSAGE = `The field 'startDate' should be less than or equals to the field 'endDate'`;
export const TASK_BR_02_MESSAGE = `The field 'endDate' must be presented with the field 'startDate'`;
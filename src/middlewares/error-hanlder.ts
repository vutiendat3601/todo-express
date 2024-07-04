import { NextFunction, Request, Response } from 'express';
import AppError from '../common/type/Error';
import logger from '../utils/logger';
import { INTERNAL_SERVER_ERROR } from '../common/constant';

export default function handleAppError(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err) {
    logger.error(err.message);
    const status = err.status;
    const message = err.message;
    res.status(status).json({ message, status });
    return;
  }
  res
    .status(INTERNAL_SERVER_ERROR)
    .json({ message: 'Internal Server Error', status: INTERNAL_SERVER_ERROR });
}

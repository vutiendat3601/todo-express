import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { BAD_REQUEST_STATUS } from '../common/constant';

export default function validationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
    return;
  }
  res
    .status(BAD_REQUEST_STATUS)
    .json({ message: result.array()[0].msg, status: BAD_REQUEST_STATUS });
}

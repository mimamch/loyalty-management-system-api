import { NextFunction, Request, Response } from "express";
import ValidationError from "../../utils/error/validation_error";
import { responseErrorWithMessage } from "../../utils/response";
import { ZodError } from "zod";

export default function errorHandlerMiddleware(
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ValidationError) {
    return res.status(400).json(responseErrorWithMessage(error.message));
  }
  if (error instanceof ZodError) {
    const message = `${error.errors[0].path.join(".")} ${
      error.errors[0].message
    }`;
    return res.status(400).json(responseErrorWithMessage(message));
  }
  console.log(error);
  return res.status(500).json(responseErrorWithMessage());
}

import User from "@/model/user";
import ValidationError from "@/utils/error/validation_error";
import { responseSuccessWithData } from "@/utils/response";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { jwtSign } from "@/utils/jwt";

export const userSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signInSchema = z
      .object({
        email: z.string().email(),
        password: z
          .string()
          .min(8)
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
          ),
        rememberMe: z.boolean(),
      })
      .parse(req.body);

    const user = await User.findOne({
      where: {
        email: signInSchema.email,
      },
    });

    if (
      !user ||
      !bcrypt.compareSync(signInSchema.password, (user as any).password)
    ) {
      throw new ValidationError("Email or password is incorrect");
    }

    const token = await jwtSign(
      (user as any).id,
      signInSchema.rememberMe ? 30 : 1
    );

    res.status(200).json(
      responseSuccessWithData({
        token: token,
      })
    );
  } catch (error) {
    next(error);
  }
};

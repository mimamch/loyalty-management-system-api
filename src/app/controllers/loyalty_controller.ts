import Loyalty from "@/model/loyalty";
import { getAvailableLoyalty } from "@/utils/loyalty";
import { responseSuccessWithData } from "@/utils/response";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const addLoyalty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = z
      .object({
        name: z.string().min(1),
        onTransactionAmount: z.number().nullable(),
        onQty: z.number().nullable(),
        onFirstPurchase: z.boolean().nullable(),
        onReferral: z.boolean().nullable(),
        onMemberActivity: z.boolean().nullable(),
        onMemberBirthday: z.boolean().nullable(),
        percentagePoint: z.number().nullable(),
        maxPercentagePoint: z.number().nullable(),
        fixedPoint: z.number().nullable(),
        start: z.coerce.date().nullable(),
        end: z.coerce.date().nullable(),
      })
      .refine(
        (data) => {
          if (
            !data.onTransactionAmount &&
            !data.onQty &&
            !data.onFirstPurchase &&
            !data.onReferral &&
            !data.onMemberActivity &&
            !data.onMemberBirthday
          ) {
            return false;
          }
          return true;
        },
        { message: "choose loyalty criteria atleast 1" }
      )
      .refine(
        (data) => {
          if (!data.fixedPoint && !data.percentagePoint) {
            return false;
          }
          if (data.fixedPoint && data.percentagePoint) {
            return false;
          }
          return true;
        },
        { message: "choose between fixedPoint or percentagePoint" }
      )
      .parse(req.body);

    const loyalty = await Loyalty.create(schema);

    res.status(200).json(responseSuccessWithData(loyalty));
  } catch (error) {
    next(error);
  }
};

export const listLoyalty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loyalties = await Loyalty.findAll();

    res.status(200).json(responseSuccessWithData(loyalties));
  } catch (error) {
    next(error);
  }
};
export const listAvailableLoyalty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loyalties = await getAvailableLoyalty();

    res.status(200).json(responseSuccessWithData(loyalties));
  } catch (error) {
    next(error);
  }
};

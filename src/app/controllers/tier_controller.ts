import {
  responseSuccessWithData,
  responseSuccessWithMessage,
} from "@/utils/response";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import Tier from "@/model/tier";

export const addTier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = z
      .object({
        tier_name: z.string(),
        min_point: z.number(),
        max_point: z.number(),
      })
      .parse(req.body);

    const tier = await Tier.create({
      tierName: schema.tier_name,
      minPoint: schema.min_point,
      maxPoint: schema.max_point,
    });

    res.status(200).json(responseSuccessWithData(tier));
  } catch (error) {
    next(error);
  }
};

export const updateTier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = z
      .object({
        tier_name: z.string(),
        min_point: z.number(),
        max_point: z.number(),
      })
      .parse(req.body);

    const tier = await Tier.update(
      {
        minPoint: schema.min_point,
        maxPoint: schema.max_point,
      },
      {
        where: {
          tierName: schema.tier_name,
        },
      }
    );

    res.status(200).json(responseSuccessWithMessage());
  } catch (error) {
    next(error);
  }
};

export const listTier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tiers = await Tier.findAll();

    res.status(200).json(responseSuccessWithData(tiers));
  } catch (error) {
    next(error);
  }
};

export const deleteTier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Tier.destroy({
      where: {
        tierName: req.params.id,
      },
    });

    res.status(200).json(responseSuccessWithMessage());
  } catch (error) {
    next(error);
  }
};

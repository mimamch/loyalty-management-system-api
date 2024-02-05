import sequelize from "@/model/db";
import Loyalty from "@/model/loyalty";
import Member from "@/model/membership";
import PointHistory from "@/model/point_history";
import {
  assignLoyalties,
  decrementMemberPoint,
  getAvailableLoyalty,
} from "@/utils/loyalty";
import {
  responseErrorWithMessage,
  responseSuccessWithData,
  responseSuccessWithMessage,
} from "@/utils/response";
import e, { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const listMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await Member.findAll();
    res.status(200).json(
      responseSuccessWithData(
        members.map((e) => ({
          memberNo: e.dataValues.id,
          name: e.dataValues.name,
          email: e.dataValues.email,
          phone: e.dataValues.phone,
          joinDate: e.dataValues.joinDate,
          remainedPoint: e.dataValues.earnedPoint - e.dataValues.redeemedPoint,
          status: e.dataValues.status,
        }))
      )
    );
  } catch (error) {
    next(error);
  }
};

export const memberDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const member = await Member.findOne({
      where: {
        id: id,
      },
    });

    if (!member) {
      return res.status(404).json(responseErrorWithMessage("Member not found"));
    }

    const historyPoint = await PointHistory.findAll({
      where: {
        memberId: member.dataValues.id,
      },
    });

    res.status(200).json(
      responseSuccessWithData({
        name: member.dataValues.name,
        email: member.dataValues.email,
        phone: member.dataValues.phone,
        birthDate: member.dataValues.birthDate,
        address: member.dataValues.address,
        joinDate: member.dataValues.joinDate,
        referral: member.dataValues.referral,
        earnedPoint: member.dataValues.earnedPoint,
        redeemedPoint: member.dataValues.redeemedPoint,
        remainedPoint:
          member.dataValues.earnedPoint - member.dataValues.redeemedPoint,
        status: member.dataValues.status,
        historyPoint: historyPoint.map((e) => ({
          transactionId: e.dataValues.id,
          transactionDate: e.dataValues.transactionDate,
          transactionName: e.dataValues.transactionName,
          type: e.dataValues.type,
          point: e.dataValues.amount,
        })),
      })
    );
  } catch (error) {
    next(error);
  }
};

export const addMemberReferral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const t = await sequelize.transaction();
  try {
    const schema = z
      .object({
        memberId: z.number(),
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        birthDate: z.coerce.date(),
        address: z.string(),
      })
      .parse(req.body);

    const member = await Member.findOne({
      where: {
        id: schema.memberId,
      },
    });

    if (!member) {
      return res.status(404).json(responseErrorWithMessage("Member not found"));
    }

    const referral = await Member.create(
      {
        name: schema.name,
        email: schema.email,
        phone: schema.phone,
        joinDate: new Date(),
        status: "active",
        birthDate: schema.birthDate,
        address: schema.address,
        referral: schema.memberId,
      },
      { transaction: t }
    );

    // process reward
    const loyalties = (await getAvailableLoyalty()).filter(
      (e) => e.dataValues.onReferral == true
    );

    await assignLoyalties(t, {
      loyalties: loyalties,
      memberId: member.dataValues.id,
    });

    await t.commit();
    res.status(200).json(responseSuccessWithData(referral));
  } catch (error) {
    t.rollback();
    next(error);
  }
};
export const addMemberActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const t = await sequelize.transaction();
  try {
    const schema = z
      .object({
        memberId: z.number(),
      })
      .parse(req.body);

    const member = await Member.findOne({
      where: {
        id: schema.memberId,
      },
    });

    if (!member) {
      return res.status(404).json(responseErrorWithMessage("Member not found"));
    }

    // process reward
    const loyalties = (await getAvailableLoyalty()).filter(
      (e) => e.dataValues.onMemberActivity == true
    );

    await assignLoyalties(t, {
      loyalties: loyalties,
      memberId: member.dataValues.id,
    });

    await t.commit();
    res.status(200).json(responseSuccessWithMessage());
  } catch (error) {
    t.rollback();
    next(error);
  }
};

export const memberRedeemRoyalty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const t = await sequelize.transaction();
  try {
    const schema = z
      .object({
        memberId: z.number(),
        amount: z.number(),
      })
      .parse(req.body);

    const member = await Member.findByPk(schema.memberId);
    if (!member) {
      return res.status(404).json(responseErrorWithMessage("Member not found"));
    }

    const initialPoint =
      member.dataValues.earnedPoint - member.dataValues.redeemedPoint;

    if (initialPoint < schema.amount) {
      return res
        .status(400)
        .json(responseErrorWithMessage("Insufficient point"));
    }

    await decrementMemberPoint(t, {
      amount: schema.amount,
      memberId: member.dataValues.id,
      transactionName: "Point Redeem",
    });
    await t.commit();

    res.status(200).json(responseSuccessWithMessage("Point redeemed"));
  } catch (error) {
    t.rollback();
    next(error);
  }
};

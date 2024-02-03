import Member from "@/model/membership";
import {
  responseErrorWithMessage,
  responseSuccessWithData,
} from "@/utils/response";
import e, { NextFunction, Request, Response } from "express";

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
        // historyPoint:
      })
    );
  } catch (error) {
    next(error);
  }
};

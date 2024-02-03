import Loyalty from "@/model/loyalty";
import Member from "@/model/membership";
import PointHistory from "@/model/point_history";
import { Model, Op, Transaction } from "sequelize";

export const getAvailableLoyalty = async () => {
  return await Loyalty.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            {
              start: {
                [Op.lte]: new Date(),
              },
            },
            {
              start: {
                [Op.is]: null,
              },
            },
          ],
        },
        {
          [Op.or]: [
            {
              end: {
                [Op.gte]: new Date(),
              },
            },
            {
              end: {
                [Op.is]: null,
              },
            },
          ],
        },
      ],
    },
  });
};

export const incrementMemberPoint = async (
  t: Transaction,
  {
    memberId,
    amount,
    transactionName,
  }: { memberId: number; amount: number; transactionName: string }
) => {
  const member = await Member.findByPk(memberId);
  if (!member) throw new Error("Member not found");
  const initialPoint =
    member.dataValues.earnedPoint - member.dataValues.redeemedPoint;

  await member.increment("earnedPoint", {
    by: amount,
    transaction: t,
  });

  await PointHistory.create(
    {
      transactionName: transactionName,
      transactionDate: new Date(),
      type: "earned",
      amount: amount,
      initialPoint: initialPoint,
      memberId: memberId,
    },
    {
      transaction: t,
    }
  );
};

export const decrementMemberPoint = async (
  t: Transaction,
  {
    memberId,
    amount,
    transactionName,
  }: { memberId: number; amount: number; transactionName: string }
) => {
  const member = await Member.findByPk(memberId);
  if (!member) throw new Error("Member not found");
  const initialPoint =
    member.dataValues.earnedPoint - member.dataValues.redeemedPoint;

  await member.increment("redeemedPoint", {
    by: amount,
    transaction: t,
  });

  await PointHistory.create(
    {
      transactionName: transactionName,
      transactionDate: new Date(),
      type: "redeemed",
      amount: amount,
      initialPoint: initialPoint,
      memberId: memberId,
    },
    {
      transaction: t,
    }
  );
};

export const assignLoyalties = async (
  t: Transaction,
  {
    loyalties,
    memberId,
    transactionAmount,
  }: {
    loyalties: Model<any, any>[];
    memberId: number;
    transactionAmount?: number;
  }
) => {
  for (const loyalty of loyalties) {
    if (loyalty.dataValues.fixedPoint) {
      await incrementMemberPoint(t, {
        transactionName: loyalty.dataValues.name,
        amount: loyalty.dataValues.fixedPoint,
        memberId: memberId,
      });
    }

    if (loyalty.dataValues.percentagePoint && !transactionAmount) {
      throw new Error("transactionAmount is required");
    }
    if (loyalty.dataValues.percentagePoint) {
      let amount = Math.floor(
        (loyalty.dataValues.percentagePoint / 100) * transactionAmount!
      );

      if (loyalty.dataValues.maxPercentagePoint) {
        amount = Math.min(amount, loyalty.dataValues.maxPercentagePoint);
      }

      await incrementMemberPoint(t, {
        transactionName: loyalty.dataValues.name,
        amount: amount,
        memberId: memberId,
      });
    }
  }
};

import ValidationError from "@/utils/error/validation_error";
import { responseSuccessWithData } from "@/utils/response";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import Member from "@/model/membership";
import Transaction from "@/model/transaction";
import TransactionProduct from "@/model/transaction_product";
import sequelize from "@/model/db";
import { generateTransactionId } from "@/utils/id";
import {
  assignLoyalties,
  getAvailableLoyalty,
  incrementMemberPoint,
} from "@/utils/loyalty";

export const addTransactionMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const t = await sequelize.transaction();
  try {
    const schema = z
      .object({
        memberNo: z.number(),
        items: z
          .object({
            itemName: z.string(),
            itemPrice: z.number().min(1),
            qty: z.number().min(1),
          })
          .array(),
      })
      .parse(req.body);

    const member = await Member.findOne({
      where: {
        id: schema.memberNo,
      },
    });

    if (!member) {
      throw new ValidationError("Member not found");
    }

    const items = schema.items.map((e) => ({
      productName: e.itemName,
      productPrice: e.itemPrice,
      subTotal: e.itemPrice * e.qty,
      productQty: e.qty,
    }));

    const trxId = await generateTransactionId();

    const isEverTransactionBefore = !!(await Transaction.findOne({
      where: {
        memberId: member.dataValues.id,
      },
    }));

    const transaction = await Transaction.create(
      {
        id: trxId,
        totalAmount: items.reduce((acc, e) => acc + e.subTotal, 0),
        memberId: member.dataValues.id,
      },
      {
        transaction: t,
      }
    );

    const itemsSaved = await TransactionProduct.bulkCreate(
      items.map((e) => ({
        ...e,
        transactionId: transaction.dataValues.id,
      })),
      { transaction: t }
    );

    // process reward loyalty
    const loyalties = (await getAvailableLoyalty()).filter((e) => {
      if (e.dataValues.onFirstPurchase && !isEverTransactionBefore) {
        return true;
      }

      if (
        e.dataValues.onTransactionAmount &&
        transaction.dataValues.totalAmount >= e.dataValues.onTransactionAmount
      ) {
        return true;
      }

      const totalQty = items.reduce((acc, e) => acc + e.productQty, 0);
      if (e.dataValues.onQty && totalQty >= e.dataValues.onQty) {
        return true;
      }

      return false;
    });

    await assignLoyalties(t, {
      loyalties,
      memberId: member.dataValues.id,
      transactionAmount: transaction.dataValues.totalAmount,
    });

    // end process reward loyalty

    await t.commit();
    res.status(200).json(
      responseSuccessWithData({
        ...transaction.dataValues,
        items: itemsSaved,
      })
    );
  } catch (error) {
    t.rollback();
    next(error);
  }
};

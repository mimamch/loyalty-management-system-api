import Member from "@/model/membership";
import PointHistory from "@/model/point_history";
import { responseSuccessWithData } from "@/utils/response";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { z } from "zod";
import excel from "exceljs";
import moment from "moment";
import { env } from "@/defaults/env";

let aspose: any = {};
aspose.cells = require("aspose.cells");

export const reportEarned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = z
      .object({
        memberId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .refine(
        (e) => {
          if ((e.startDate || e.endDate) && (!e.startDate || !e.endDate))
            return false;
          return true;
        },
        { message: "must fill both of startDate & endDate" }
      )
      .parse(req.query);
    const report = await PointHistory.findAll({
      where: {
        type: "earned",
        ...(query.memberId && {
          memberId: query.memberId,
        }),
        ...(query.startDate &&
          query.endDate && {
            createdAt: {
              [Op.between]: [query.startDate, query.endDate],
            },
          }),
      },
      include: [
        {
          model: Member,
          attributes: ["name"],
        },
      ],
    });

    res.status(200).json(
      responseSuccessWithData(
        report.map((e) => ({
          ...e.dataValues,
          Member: undefined,
          memberNo: e.dataValues.memberId,
          memberName: e.dataValues.Member.name,
          balance:
            e.dataValues.type == "earned"
              ? e.dataValues.initialPoint + e.dataValues.amount
              : e.dataValues.initialPoint - e.dataValues.amount,
        }))
      )
    );
  } catch (error) {
    next(error);
  }
};

export const reportRedemeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = z
      .object({
        memberId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .refine(
        (e) => {
          if ((e.startDate || e.endDate) && (!e.startDate || !e.endDate))
            return false;
          return true;
        },
        { message: "must fill both of startDate & endDate" }
      )
      .parse(req.query);
    const report = await PointHistory.findAll({
      where: {
        type: "redeemed",
        ...(query.memberId && {
          memberId: query.memberId,
        }),
        ...(query.startDate &&
          query.endDate && {
            createdAt: {
              [Op.between]: [query.startDate, query.endDate],
            },
          }),
      },
      include: [
        {
          model: Member,
          attributes: ["name"],
        },
      ],
    });

    res.status(200).json(
      responseSuccessWithData(
        report.map((e) => ({
          ...e.dataValues,
          Member: undefined,
          memberNo: e.dataValues.memberId,
          memberName: e.dataValues.Member.name,
          balance:
            e.dataValues.type == "earned"
              ? e.dataValues.initialPoint + e.dataValues.amount
              : e.dataValues.initialPoint - e.dataValues.amount,
        }))
      )
    );
  } catch (error) {
    next(error);
  }
};

export const exportData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workBook = new excel.Workbook();
    const memberSheet = workBook.addWorksheet("Member");
    const members = await Member.findAll({
      include: [
        {
          model: Member,
          as: "Referral",
          attributes: ["name"],
        },
      ],
    });
    memberSheet.columns = [
      {
        header: "ID",
        key: "id",
        width: 5,
      },
      {
        header: "Name",
        key: "name",
        width: 30,
      },
      {
        header: "Email",
        key: "email",
        width: 30,
      },
      {
        header: "Phone",
        key: "phone",
        width: 20,
      },
      {
        header: "Join Date",
        key: "joinDate",
        width: 15,
      },
      {
        header: "Status",
        key: "status",
        width: 10,
      },
      {
        header: "Birth Date",
        key: "birthDate",
        width: 15,
      },
      {
        header: "Address",
        key: "address",
        width: 30,
      },
      {
        header: "Referral",
        key: "referral",
        width: 30,
      },
      {
        header: "Earned Point",
        key: "earnedPoint",
        width: 15,
      },
      {
        header: "Redeemed Point",
        key: "redeemedPoint",
        width: 15,
      },
      {
        header: "Remaired Point",
        key: "remairedPoint",
        width: 15,
      },
    ];
    for (const member of members) {
      memberSheet.addRow({
        id: member.dataValues.id,
        name: member.dataValues.name,
        email: member.dataValues.email,
        phone: member.dataValues.phone,
        joinDate: member.dataValues.joinDate,
        status: member.dataValues.status,
        birthDate: member.dataValues.birthDate,
        address: member.dataValues.address,
        referral: member.dataValues?.Referral?.name || "",
        earnedPoint: member.dataValues.earnedPoint,
        redeemedPoint: member.dataValues.redeemedPoint,
        remairedPoint:
          member.dataValues.earnedPoint - member.dataValues.redeemedPoint,
      });
    }

    const pointHistorySheet = workBook.addWorksheet("Point History");
    const pointHistory = await PointHistory.findAll({
      include: [
        {
          model: Member,
          attributes: ["name"],
        },
      ],
    });

    pointHistorySheet.columns = [
      {
        header: "ID",
        key: "id",
        width: 5,
      },
      {
        header: "Transaction Name",
        key: "transactionName",
        width: 30,
      },
      {
        header: "Transaction Date",
        key: "transactionDate",
        width: 15,
      },
      {
        header: "Type",
        key: "type",
        width: 10,
      },
      {
        header: "Amount",
        key: "amount",
        width: 15,
      },
      {
        header: "Member",
        key: "member",
        width: 30,
      },
    ];
    for (const history of pointHistory) {
      pointHistorySheet.addRow({
        id: history.dataValues.id,
        transactionName: history.dataValues.transactionName,
        transactionDate: history.dataValues.transactionDate,
        type: history.dataValues.type,
        amount: history.dataValues.amount,
        member: history.dataValues?.Member?.name || "",
      });
    }

    const fileName = `report-${moment().format("YYYY-MM-DD")}`;

    await workBook.xlsx.writeFile(`public/export/${fileName}.xlsx`);

    console.log(">>>>", aspose?.cells?.Workbook);
    const wb = new aspose.cells.Workbook(`public/export/${fileName}.xlsx`);
    const saveOptions = aspose.cells.PdfSaveOptions();
    saveOptions.setOnePagePerSheet(true);
    wb.save(`public/export/${fileName}.pdf`, saveOptions);

    res.status(200).json(
      responseSuccessWithData({
        xlsx: `http://localhost:${env.PORT}/p/export/${fileName}.xlsx`,
        pdf: `http://localhost:${env.PORT}/p/export/${fileName}.pdf`,
      })
    );
  } catch (error) {
    next(error);
  }
};

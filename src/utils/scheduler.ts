import Member from "@/model/membership";
import cron from "node-cron";
import { assignLoyalties, getAvailableLoyalty } from "./loyalty";
import { Op, QueryTypes, Sequelize } from "sequelize";
import sequelize from "@/model/db";
import PointHistory from "@/model/point_history";
import moment from "moment";

const birthdayScheduler = async () => {
  const loyalties = (await getAvailableLoyalty()).filter(
    (e) => e.dataValues.onMemberBirthday
  );
  if (!loyalties.length) return;

  // get members whose birthday is today
  const members: any = await sequelize.query(
    `SELECT
  * 
FROM
  "Members" 
WHERE
  DATE_PART( 'day', "birthDate" ) = date_part( 'day', CURRENT_DATE ) 
  AND DATE_PART( 'month', "birthDate" ) = date_part( 'month', CURRENT_DATE )`,
    {
      type: QueryTypes.SELECT,
    }
  );

  const t = await sequelize.transaction();
  for (const loyalty of loyalties) {
    for (const m of members) {
      const isAlreadyRewarded = !!(await PointHistory.findOne({
        where: {
          memberId: m.id,
          transactionName: loyalty.dataValues.name,
          transactionDate: {
            [Op.gte]: moment().startOf("day").toDate(),
            [Op.lte]: moment().endOf("day").toDate(),
          },
        },
      }));
      if (isAlreadyRewarded) continue;
      await assignLoyalties(t, {
        loyalties: [loyalty],
        memberId: m.id,
      });
    }
  }
  await t.commit();
};

export const initScheduler = () => {
  birthdayScheduler();
  cron.schedule("0 0 * * *", () => {
    birthdayScheduler();
  });
};

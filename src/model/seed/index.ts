import Loyalty from "../loyalty";
import Member from "../membership";
import PointHistory from "../point_history";
import Tier from "../tier";
import Transaction from "../transaction";
import TransactionProduct from "../transaction_product";
import User from "../user";
import { seedMember } from "./member";
import { seedUser } from "./user";

(async () => {
  await User.sync({ force: true });
  await Member.sync({ force: true });
  await PointHistory.sync({ force: true });
  await Tier.sync({ force: true });
  await Transaction.sync({ force: true });
  await TransactionProduct.sync({ force: true });
  await Loyalty.sync({ force: true });
  await PointHistory.sync({ force: true });

  await seedUser();
  await seedMember();
})();

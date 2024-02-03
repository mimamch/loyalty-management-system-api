import { env } from "@/defaults/env";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(env.DATABASE_URL);

export default sequelize;

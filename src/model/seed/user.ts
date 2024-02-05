import User from "../user";
import bcrypt from "bcrypt";

export const seedUser = async () => {
  const user = await User.create({
    email: "admin@gmail.com",
    password: bcrypt.hashSync("Password123@", 10),
  });

  console.log(user);
};

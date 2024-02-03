import jwt from "jsonwebtoken";

export const jwtVerify = (encoded: string): Record<string, any> | null => {
  try {
    return jwt.verify(encoded, "secret") as Record<string, any>;
  } catch (error) {
    return null;
  }
};

export const jwtSign = async (idUser: string, expInDays = 1) => {
  return jwt.sign(
    {
      idUser: idUser,
    },
    "secret",
    {
      expiresIn: `${expInDays}d`,
    }
  );
};

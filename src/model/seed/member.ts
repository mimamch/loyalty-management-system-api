import Member from "../membership";

export const seedMember = async () => {
  const data = await Member.create({
    name: "John Doe",
    email: "john@gmail.com",
    phone: "08123456789",
    joinDate: new Date(),
    status: "active",
    birthDate: new Date(),
    address: "Jl. Raya Abc No. 123",
  });

  console.log(data);
};

const { PrismaClient } = require("../node_modules/@prisma/client");
const bcrypt = require("bcrypt");

const email = "wisebacasol@gmail.com";
const password = "Bacas1995";
const fullName = "Administrador";

const prisma = new PrismaClient();

const run = async () => {
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      password: hash,
      profile: {
        upsert: {
          create: { fullName },
          update: { fullName },
        },
      },
    },
    create: {
      email,
      password: hash,
      role: "ADMIN",
      profile: { create: { fullName } },
    },
  });

  console.log(`ADMIN criado/atualizado: ${user.email}`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
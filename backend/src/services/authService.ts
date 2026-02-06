import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_EXPIRES_IN = "7d";

export const registerUser = async (email: string, password: string, fullName: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email já cadastrado");
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      profile: {
        create: {
          fullName,
        },
      },
    },
    include: { profile: true },
  });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET ?? "", {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET ?? "", {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
};
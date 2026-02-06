import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

router.get("/users", authenticate, authorizeAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true, profile: true },
  });

  return res.json(users);
});

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(["USER", "ADMIN", "VIP"]).optional(),
});

router.post("/users", authenticate, authorizeAdmin, async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  const { email, password, fullName, role } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email já cadastrado" });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      role: role ?? "USER",
      profile: { create: { fullName } },
    },
    include: { profile: true },
  });

  return res.status(201).json(user);
});

const updateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  role: z.enum(["USER", "ADMIN", "VIP"]).optional(),
  password: z.string().min(6).optional(),
});

router.put("/users/:id", authenticate, authorizeAdmin, async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  const { id } = req.params;
  const { fullName, role, password } = parsed.data;

  const data: { role?: "USER" | "ADMIN" | "VIP"; password?: string; profile?: { update: { fullName?: string } } } = {};
  if (role) data.role = role;
  if (password) data.password = await bcrypt.hash(password, 10);
  if (fullName) data.profile = { update: { fullName } };

  const user = await prisma.user.update({
    where: { id },
    data,
    include: { profile: true },
  });

  return res.json(user);
});

router.delete("/users/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  return res.status(204).send();
});

export default router;
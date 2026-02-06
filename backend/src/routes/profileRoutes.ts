import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authenticate, type AuthRequest } from "../middleware/auth";

const router = Router();

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const profile = await prisma.profile.findUnique({
    where: { userId: req.user?.id },
  });

  if (!profile) {
    return res.status(404).json({ message: "Perfil não encontrado" });
  }

  return res.json(profile);
});

router.put("/me", authenticate, async (req: AuthRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  const profile = await prisma.profile.update({
    where: { userId: req.user?.id },
    data: parsed.data,
  });

  return res.json(profile);
});

export default router;
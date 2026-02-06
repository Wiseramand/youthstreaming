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
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return res.status(404).json({ message: "Perfil não encontrado" });
  }

  return res.json(profile);
});

router.put("/me", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  const data: { fullName?: string; avatarUrl?: string; bio?: string } = {};
  if (parsed.data.fullName) data.fullName = parsed.data.fullName;
  if (parsed.data.avatarUrl) data.avatarUrl = parsed.data.avatarUrl;
  if (parsed.data.bio) data.bio = parsed.data.bio;

  const profile = await prisma.profile.update({
    where: { userId },
    data,
  });

  return res.json(profile);
});

export default router;
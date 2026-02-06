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

  try {
    // Buscar perfil no Prisma
    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado" });
    }

    return res.json(profile);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ message: "Erro ao buscar perfil" });
  }
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

  try {
    const updates: any = {};
    if (parsed.data.fullName) updates.fullName = parsed.data.fullName;
    if (parsed.data.avatarUrl) updates.avatarUrl = parsed.data.avatarUrl;
    if (parsed.data.bio) updates.bio = parsed.data.bio;

    const profile = await prisma.profile.update({
      where: {
        userId: userId
      },
      data: updates
    });

    return res.json(profile);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
});

export default router;

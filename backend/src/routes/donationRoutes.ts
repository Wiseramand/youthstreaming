import { Router } from "express";
import { z } from "zod";
import { authenticate, type AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

const donationSchema = z.object({
  amount: z.number().min(1),
  method: z.string().min(2),
  identifier: z.string().optional(),
  name: z.string().optional(),
});

router.get("/donations", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    // Buscar doações no Prisma
    const donations = await prisma.donation.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    return res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ message: "Erro ao buscar doações" });
  }
});

router.post("/donations", authenticate, async (req: AuthRequest, res) => {
  const parsed = donationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const newDonation = await prisma.donation.create({
      data: {
        amount: parsed.data.amount,
        method: parsed.data.method,
        identifier: parsed.data.identifier || null,
        name: parsed.data.name || null,
        userId: userId
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    return res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error creating donation:", error);
    return res.status(500).json({ message: "Erro ao criar doação" });
  }
});

// Rota para administradores verem todas as doações
router.get("/admin/donations", authenticate, async (req: AuthRequest, res) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado" });
  }

  try {
    // Buscar todas as doações no Prisma
    const donations = await prisma.donation.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    return res.json(donations);
  } catch (error) {
    console.error("Error fetching all donations:", error);
    return res.status(500).json({ message: "Erro ao buscar doações" });
  }
});

export default router;

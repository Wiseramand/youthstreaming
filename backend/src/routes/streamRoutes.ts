import { Router } from "express";
import { z } from "zod";
import { authenticate, authorizeAdmin, type AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

const streamSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().default(""),
  sourceType: z.enum(["YOUTUBE", "OBS"]),
  sourceUrl: z.string().min(3),
  thumbnail: z.string().min(3),
  category: z.string().optional().default("Geral"),
  isLive: z.boolean().default(true),
  accessLevel: z.enum(["PUBLIC", "VIP"]).default("PUBLIC"),
  viewers: z.number().optional().default(0),
});

router.get("/streams", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Buscar streams no Prisma
    const streams = await prisma.stream.findMany({
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

    return res.json(streams);
  } catch (error) {
    console.error("Error fetching streams:", error);
    return res.status(500).json({ message: "Erro ao buscar streams" });
  }
});

router.post("/streams", authenticate, async (req: AuthRequest, res) => {
  const parsed = streamSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const newStream = await prisma.stream.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        sourceType: parsed.data.sourceType,
        sourceUrl: parsed.data.sourceUrl,
        thumbnail: parsed.data.thumbnail,
        category: parsed.data.category,
        isLive: parsed.data.isLive,
        accessLevel: parsed.data.accessLevel,
        viewers: parsed.data.viewers,
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

    return res.status(201).json(newStream);
  } catch (error) {
    console.error("Error creating stream:", error);
    return res.status(500).json({ message: "Erro ao criar stream" });
  }
});

// Rota para administradores gerenciarem todos os streams
router.get("/admin/streams", authenticate, authorizeAdmin, async (_req, res) => {
  try {
    // Buscar todos os streams no Prisma
    const streams = await prisma.stream.findMany({
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

    return res.json(streams);
  } catch (error) {
    console.error("Error fetching all streams:", error);
    return res.status(500).json({ message: "Erro ao buscar streams" });
  }
});

router.put("/admin/streams/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: "ID inválido" });
  }
  
  const parsed = streamSchema.safeParse(req.body);
  
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  try {
    const updatedStream = await prisma.stream.update({
      where: {
        id: id
      },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        sourceType: parsed.data.sourceType,
        sourceUrl: parsed.data.sourceUrl,
        thumbnail: parsed.data.thumbnail,
        category: parsed.data.category,
        isLive: parsed.data.isLive,
        accessLevel: parsed.data.accessLevel,
        viewers: parsed.data.viewers
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    return res.json(updatedStream);
  } catch (error) {
    console.error("Error updating stream:", error);
    return res.status(500).json({ message: "Erro ao atualizar stream" });
  }
});

router.delete("/admin/streams/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: "ID inválido" });
  }
  
  try {
    await prisma.stream.delete({
      where: {
        id: id
      }
    });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting stream:", error);
    return res.status(500).json({ message: "Erro ao deletar stream" });
  }
});

export default router;

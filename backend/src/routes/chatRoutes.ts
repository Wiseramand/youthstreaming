import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

type ChatMessage = {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string | undefined;
  text: string;
  timestamp: string;
  is_admin?: boolean | undefined;
};

const router = Router();

const messageSchema = z.object({
  userId: z.string().min(1),
  userName: z.string().min(1),
  userAvatar: z.string().optional(),
  text: z.string().min(1),
  isAdmin: z.boolean().optional(),
});

router.get("/chat", async (_req, res) => {
  try {
    // Buscar mensagens no Prisma
    const messages = await prisma.chatMessage.findMany({
      orderBy: {
        timestamp: 'desc'
      }
    });

    return res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
});

router.post("/chat", async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  try {
    const newMessage = await prisma.chatMessage.create({
      data: {
        userId: parsed.data.userId,
        userName: parsed.data.userName,
        userAvatar: parsed.data.userAvatar || null,
        text: parsed.data.text,
        isAdmin: parsed.data.isAdmin || false,
        timestamp: new Date().toISOString(),
      }
    });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    return res.status(500).json({ message: "Erro ao criar mensagem" });
  }
});

export default router;

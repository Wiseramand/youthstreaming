import { Router } from "express";
import { z } from "zod";

type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | undefined;
  text: string;
  timestamp: string;
  isAdmin?: boolean | undefined;
};

const router = Router();
const messages: ChatMessage[] = [
  {
    id: "1",
    userId: "system",
    userName: "Youth Angola Bot",
    text: "Bem-vindo ao chat ao vivo! Digam de onde nos acompanham 🇦🇴",
    timestamp: new Date().toISOString(),
    isAdmin: true,
  },
];

const messageSchema = z.object({
  userId: z.string().min(1),
  userName: z.string().min(1),
  userAvatar: z.string().optional(),
  text: z.string().min(1),
  isAdmin: z.boolean().optional(),
});

router.get("/chat", (_req, res) => {
  return res.json(messages);
});

router.post("/chat", (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...parsed.data,
  };

  messages.push(newMessage);
  return res.status(201).json(newMessage);
});

export default router;
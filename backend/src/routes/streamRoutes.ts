import { Router } from "express";
import { z } from "zod";
import { authenticate, authorizeAdmin } from "../middleware/auth";

type StreamAccess = "PUBLIC" | "VIP";
type StreamSource = "YOUTUBE" | "OBS";

type StreamItem = {
  id: string;
  title: string;
  description: string;
  sourceType: StreamSource;
  sourceUrl: string;
  thumbnail: string;
  category: string;
  isLive: boolean;
  accessLevel: StreamAccess;
  viewers: number;
};

const streams: StreamItem[] = [];

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

router.get("/streams", (_req, res) => {
  return res.json(streams);
});

router.post("/streams", authenticate, authorizeAdmin, (req, res) => {
  const parsed = streamSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  const newStream: StreamItem = {
    id: `stream_${Date.now()}`,
    ...parsed.data,
  };

  streams.unshift(newStream);
  return res.status(201).json(newStream);
});

router.delete("/streams/:id", authenticate, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const index = streams.findIndex((stream) => stream.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Stream não encontrada" });
  }

  streams.splice(index, 1);
  return res.status(204).send();
});

export default router;
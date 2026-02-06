import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { loginUser, registerUser } from "../services/authService";
import prisma from "../lib/prisma";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  try {
    const result = await registerUser(parsed.data.email, parsed.data.password, parsed.data.fullName);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  try {
    const result = await loginUser(parsed.data.email, parsed.data.password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message });
  }
});

const resetSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
});

router.post("/reset-password", async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  const { email, newPassword } = parsed.data;
  
  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Criar hash da nova senha
    const hash = await bcrypt.hash(newPassword, 10);
    
    // Atualizar senha
    await prisma.user.update({
      where: { email },
      data: { password: hash }
    });

    return res.json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ message: "Erro ao redefinir senha" });
  }
});

// Rota de teste
router.get("/test", (req, res) => {
  res.json({ message: "API de autenticação está funcionando corretamente!" });
});

export default router;

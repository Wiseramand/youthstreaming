import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

router.get("/users", authenticate, authorizeAdmin, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ message: "Erro ao buscar usuários" });
  }
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
  
  try {
    // Verificar se o email já existe
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existing) {
      return res.status(409).json({ message: "Email já cadastrado" });
    }

    // Criar hash da senha
    const hash = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        role: role ?? "USER",
        profile: {
          create: {
            fullName
          }
        }
      },
      include: {
        profile: true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: "Erro ao criar usuário" });
  }
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
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: "ID inválido" });
  }
  
  const { fullName, role, password } = parsed.data;

  try {
    const updates: any = {};
    if (role) updates.role = role;
    if (password) updates.password = await bcrypt.hash(password, 10);

    // Atualizar usuário
    if (Object.keys(updates).length > 0) {
      await prisma.user.update({
        where: { id },
        data: updates
      });
    }

    // Atualizar perfil
    if (fullName) {
      await prisma.profile.update({
        where: { userId: id },
        data: { fullName }
      });
    }

    // Retornar usuário atualizado
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

router.delete("/users/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: "ID inválido" });
  }
  
  try {
    // Deletar perfil primeiro (por causa da foreign key)
    await prisma.profile.delete({
      where: { userId: id }
    });
    
    // Deletar usuário
    await prisma.user.delete({
      where: { id }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ message: "Erro ao deletar usuário" });
  }
});

export default router;

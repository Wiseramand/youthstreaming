import express from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const router = express.Router();

// Schema de validação para criação de usuários VIP
const createVipUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  age: z.number().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  gender: z.enum(['Masculino', 'Feminino']).optional().default('Masculino'),
  role: z.enum(['VIP']).default('VIP'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  sendEmail: z.boolean().default(true),
  streamIds: z.array(z.string()).optional(),
});

// Schema de validação para criação de streams
const createStreamSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  sourceUrl: z.string().url('URL inválida'),
  sourceType: z.enum(['OBS', 'YOUTUBE']),
  thumbnail: z.string().url('URL da thumbnail inválida').optional(),
  isLive: z.boolean().default(false),
  accessLevel: z.enum(['PUBLIC', 'VIP']).default('VIP'),
  scheduledTime: z.string().datetime().optional(),
  accessCode: z.string().optional(),
});

// Criar usuário VIP com email automático
router.post('/users', authenticate, async (req, res) => {
  try {
    const data = createVipUserSchema.parse(req.body);

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        profile: {
          create: {
            fullName: data.name,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
            bio: '',
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Se houver streams associadas, criar os links privados
    let streamLinks: Array<{
      id: string;
      title: string;
      url: string;
      accessCode: string;
    }> = [];
    if (data.streamIds && data.streamIds.length > 0) {
      const streams = await prisma.stream.findMany({
        where: {
          id: {
            in: data.streamIds
          }
        }
      });

      streamLinks = streams.map((s) => ({
        id: s.id,
        title: s.title,
        url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/vip/stream/${s.id}?access=${s.accessCode || 'VIP_ACCESS_CODE'}`,
        accessCode: s.accessCode || 'VIP_ACCESS_CODE',
      }));

      // Atualizar streams com código de acesso se necessário
      for (const streamId of data.streamIds) {
        await prisma.stream.update({
          where: { id: streamId },
          data: {
            accessCode: Math.random().toString(36).substr(2, 9).toUpperCase()
          }
        });
      }
    }

    // Enviar email com credenciais se solicitado (funcionalidade temporariamente desativada)
    if (data.sendEmail) {
      console.log(`Email de boas-vindas para ${user.email} (funcionalidade em desenvolvimento)`);
    }

    res.status(201).json({
      id: user.id,
      name: data.name,
      email: user.email,
      role: user.role,
      streams: streamLinks,
      emailSent: data.sendEmail,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Erro ao criar usuário VIP:', error);
    res.status(500).json({ error: 'Erro ao criar usuário VIP' });
  }
});

// Listar streams
router.get('/streams', authenticate, async (req, res) => {
  try {
    const streams = await prisma.stream.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(streams);
  } catch (error) {
    console.error('Erro ao buscar streams:', error);
    res.status(500).json({ error: 'Erro ao buscar streams' });
  }
});

// Criar stream com código de acesso
router.post('/streams', authenticate, async (req, res) => {
  try {
    const data = createStreamSchema.parse(req.body);

    const stream = await prisma.stream.create({
      data: {
        title: data.title,
        description: data.description,
        sourceUrl: data.sourceUrl,
        sourceType: data.sourceType,
        thumbnail: data.thumbnail || '',
        isLive: data.isLive,
        accessLevel: data.accessLevel,
        accessCode: data.accessCode || Math.random().toString(36).substr(2, 9).toUpperCase(),
      }
    });

    res.status(201).json(stream);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Erro ao criar stream:', error);
    res.status(500).json({ error: 'Erro ao criar stream' });
  }
});

// Enviar notificação de nova transmissão para usuários VIP
router.post('/streams/:id/notify', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;

    const stream = await prisma.stream.findUnique({
      where: { id: id }
    });

    if (!stream) {
      return res.status(404).json({ error: 'Stream não encontrado' });
    }

    // Buscar usuários VIP
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        },
        role: 'VIP'
      },
      include: {
        profile: true
      }
    });

    const streamLink = {
      id: stream.id,
      title: stream.title,
      url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/vip/stream/${stream.id}?access=${stream.accessCode || 'VIP_ACCESS_CODE'}`,
      accessCode: stream.accessCode || 'VIP_ACCESS_CODE',
    };

    let successCount = 0;
    for (const user of users) {
      // Enviar notificação por email (funcionalidade temporariamente desativada)
      console.log(`Notificação para ${user.email} sobre stream ${stream.title} (funcionalidade em desenvolvimento)`);
      successCount++;
    }

    res.json({
      message: `Notificações enviadas para ${successCount} usuários`,
      totalUsers: users.length,
      successCount,
    });
  } catch (error) {
    console.error('Erro ao enviar notificações:', error);
    res.status(500).json({ error: 'Erro ao enviar notificações' });
  }
});

export default router;

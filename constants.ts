import { User, UserRole, Stream, ScheduleItem } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin', // Username for login per requirement
    phone: '+244 900 000 000',
    age: 30,
    city: 'Luanda',
    country: 'Angola',
    gender: 'Masculino',
    password: 'admin123',
    role: UserRole.ADMIN,
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Administrador&background=0D9488&color=fff',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '+244 923 456 789',
    age: 22,
    city: 'Luanda',
    country: 'Angola',
    gender: 'Masculino',
    password: 'password',
    role: UserRole.USER,
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=random',
    favorites: ['1'],
    createdAt: '2023-10-15T10:30:00Z'
  },
  {
    id: '3',
    name: 'Maria Costa',
    email: 'maria@example.com',
    phone: '+244 933 111 222',
    age: 25,
    city: 'Benguela',
    country: 'Angola',
    gender: 'Feminino',
    password: 'password',
    role: UserRole.VIP,
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Maria+Costa&background=F59E0B&color=fff',
    vipCredentials: {
      username: 'vip_maria',
      code: 'VIP-9988',
      expiresAt: '2024-12-31'
    },
    favorites: ['2'],
    createdAt: '2023-11-01T14:20:00Z'
  }
];

export const MOCK_STREAMS: Stream[] = [
  {
    id: '1',
    title: 'Culto de Jovens - Ao Vivo',
    description: 'Transmissão do culto especial de juventude direto da sede.',
    sourceType: 'YOUTUBE',
    sourceUrl: 'jfKfPfyJRdk', // Lofi girl as placeholder usually, but using a generic ID
    thumbnail: 'https://picsum.photos/800/450?random=1',
    category: 'Espiritual',
    isLive: true,
    accessLevel: 'PUBLIC',
    viewers: 1240
  },
  {
    id: '2',
    title: 'Mentoria Exclusiva de Liderança',
    description: 'Sessão fechada para líderes e membros VIP.',
    sourceType: 'OBS',
    sourceUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Test HLS
    thumbnail: 'https://picsum.photos/800/450?random=2',
    category: 'Educação',
    isLive: true,
    accessLevel: 'VIP',
    viewers: 45
  }
];

export const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: '1', day: 'Segunda-feira', time: '19:00', programName: 'Podcast Youth', host: 'Carlos Manuel', type: 'REPLAY' },
  { id: '2', day: 'Quarta-feira', time: '18:30', programName: 'Estudo Bíblico', host: 'Pastora Ana', type: 'LIVE' },
  { id: '3', day: 'Sexta-feira', time: '20:00', programName: 'Vigília Jovem', host: 'Equipa Louvor', type: 'LIVE' },
  { id: '4', day: 'Domingo', time: '10:00', programName: 'Culto da Família', host: 'Bispo Principal', type: 'LIVE' },
];

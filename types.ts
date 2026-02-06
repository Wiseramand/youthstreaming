export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIP = 'VIP'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  country: string;
  gender: string;
  password?: string; // In a real app, never store plain text
  role: UserRole;
  isActive: boolean;
  expirationDate?: string; // ISO Date string for when access expires
  allowedStreamIds?: string[]; // Specific streams this user can access
  avatar?: string;
  favorites?: string[]; // IDs of favorite streams
  vipCredentials?: {
    username: string;
    code: string;
    expiresAt: string;
  };
  createdAt: string;
}

export interface Stream {
  id: string;
  title: string;
  description: string;
  sourceType: 'YOUTUBE' | 'OBS';
  sourceUrl: string; // YouTube ID or HLS URL
  thumbnail: string;
  category: string;
  isLive: boolean;
  accessLevel: 'PUBLIC' | 'VIP';
  viewers: number;
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  programName: string;
  host: string;
  type: 'LIVE' | 'REPLAY';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
  isAdmin?: boolean;
}

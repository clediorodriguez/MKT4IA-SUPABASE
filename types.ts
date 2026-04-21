
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface GeneratedMedia {
  id: string;
  type: MediaType;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  media?: GeneratedMedia;
  attachment?: {
    url: string;
    type: 'image' | 'video';
    base64?: string;
  };
  isThinking?: boolean;
}

export interface ToolCallData {
  id: string;
  name: string;
  args: Record<string, any>;
}

// Database Schema Simulation
export type PlanTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface UserProfile {
  id: string;
  email: string;
  password?: string; // In real app, this is hashed. Here strictly for simulation.
  name: string;
  
  // Required DB Columns
  plano: PlanTier;
  status_assinatura: 'ativa' | 'pendente' | 'cancelada' | 'bloqueada';
  renovacao_em: string; // ISO Date
  gateway_customer_id: string;
  
  creditos: number;
  createdAt: string;
}

// Global interface for Veo key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
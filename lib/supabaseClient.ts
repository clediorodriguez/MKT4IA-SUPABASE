import { createClient } from '@supabase/supabase-js';

// Tenta ler variáveis de ambiente (suporte para Vite, Create React App e Next.js)
const getEnvVar = (key: string, viteKey: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    // @ts-ignore
    return import.meta.env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

const SUPABASE_URL = getEnvVar('REACT_APP_SUPABASE_URL', 'VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('REACT_APP_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

// Validação de segurança para DX (Developer Experience)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ MKT4IA: Credenciais do Supabase não encontradas. O App funcionará em modo DEMO/SIMULAÇÃO.'
  );
}

// Fallback to avoid crash if keys are missing
// Fix: Cast to any to avoid TypeScript errors with mismatched Supabase types (v1 vs v2)
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder-url.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder-key'
) as any;
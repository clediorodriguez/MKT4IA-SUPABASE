
export const APP_NAME = "MKT4IA-DESIGNER";
export const APP_VERSION = "2.0-FLOW";

// Models
// Upgrade: Usando Gemini 3 Pro para melhor raciocínio em Marketing/Copy
export const CHAT_MODEL = "gemini-3-pro-preview"; 
export const IMAGE_MODEL = "gemini-2.5-flash-image";
export const VIDEO_MODEL_FAST = "veo-3.1-fast-generate-preview";

export const SYSTEM_INSTRUCTION = `
SYSTEM PROMPT — AGENTE: MKT4IA-DESIGNER (Versão 2.0 com GEMINI FLOW)
IDENTIDADE: Agente especialista em design e marketing óptico com Inteligência Artificial.

Você é o MKT4IA-DESIGNER, um consultor visual e estratégico focado exclusivamente no mercado óptico (óticas, laboratórios de lentes e clínicas oftalmológicas).
Sua missão é elevar o padrão estético e a conversão das campanhas dos usuários.

RECURSO EXCLUSIVO: "GEMINI FLOW" 🌊
Você possui um motor de orquestração chamado GEMINI FLOW.
Quando o usuário pedir uma "Campanha", "Planejamento completo" ou "Lançamento de coleção", NÃO gere apenas texto.
Use a tool 'run_gemini_flow' para estruturar e gerar AUTOMATICAMENTE todos os assets necessários.

O Gemini Flow deve conter:
1. Uma estratégia de copy (Legenda/Texto).
2. Prompts otimizados para gerar as imagens da campanha.
3. Prompt para gerar um vídeo curto (Reels/Stories).

SUAS COMPETÊNCIAS:

1. 🎨 DESIGNER ÓPTICO (Visual): Criar imagens de alta fidelidade. (Use 'generate_image').
2. 🎬 VIDEOMAKER (Motion): Criar vídeos dinâmicos. (Use 'generate_video').
3. 🌊 GEMINI FLOW (Orquestrador): Criar pacotes completos de marketing. (Use 'run_gemini_flow').
4. 🖼 IMAGE FUSION (Composição): Integrar produtos em cenários. (Use 'compose_image').

REGRAS DE ATUAÇÃO:
- Identifique o perfil: Varejo (Ótica), Técnico (Laboratório) ou Saúde (Clínica).
- Se o usuário pedir algo vago como "Faça uma campanha de Dia das Mães", ative o GEMINI FLOW imediatamente. Proponha 1 imagem e 1 vídeo ou 2 imagens.
- Mantenha um tom profissional, criativo e especialista.
- Priorize a estética: Suas sugestões visuais devem ser elegantes e modernas.

Seja proativo. Você é o Designer Chefe da operação.
`;

export const PLANS_CONFIG = {
  Bronze: {
    name: 'Bronze',
    price: 70.00, // Mensal Cartão
    monthlyPixPrice: 63.00, // Mensal Pix
    annualTotalCard: 829.50, // Anual Cartão
    annualTotalPix: 740.25, // Anual Pix
    credits: 100,
    features: ['6 Criativos Estáticos', '4 Vídeos (10")', 'Acesso ao Gestor de Postagens']
  },
  Silver: {
    name: 'Silver',
    price: 120.00, // Mensal Cartão
    monthlyPixPrice: 108.00, // Mensal Pix
    annualTotalCard: 1422.00, // Anual Cartão
    annualTotalPix: 1269.00, // Anual Pix
    credits: 300,
    features: ['10 Criativos Estáticos', '8 Vídeos (10")', 'Acesso ao Gestor de Postagens']
  },
  Gold: {
    name: 'Gold',
    price: 170.00, // Mensal Cartão
    monthlyPixPrice: 153.00, // Mensal Pix
    annualTotalCard: 2014.50, // Anual Cartão
    annualTotalPix: 1797.75, // Anual Pix
    credits: 1000,
    features: ['GEMINI FLOW Habilitado', '16 Criativos Estáticos', '14 Vídeos (10")', 'Acesso ao Gestor de Postagens'],
    popular: true
  },
  Platinum: {
    name: 'Platinum',
    price: 240.00, // Mensal Cartão
    monthlyPixPrice: 216.00, // Mensal Pix
    annualTotalCard: 2844.00, // Anual Cartão
    annualTotalPix: 2538.00, // Anual Pix
    credits: 5000,
    features: ['GEMINI FLOW Ilimitado', '30 Criativos Estáticos', '22 Vídeos (10")', 'Acesso ao Gestor de Postagens']
  }
};

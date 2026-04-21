# MKT4IA Designer

Agência de Marketing Óptico com Inteligência Artificial. Direção Criativa, Design, Vídeo e Copywriting 24/7.

## Tecnologias (Stack)
- **Frontend**: React 19, TypeScript, Vite 6
- **Estilização**: Tailwind CSS v4 (@tailwindcss/postcss)
- **Backend/Auth/DB**: Supabase
- **Inteligência Artificial**: Google Gemini API (@google/genai)
- **Animações/Física**: Matter.js

## Como executar localmente

1. **Clone este repositório:**
   \`\`\`bash
   git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   cd SEU-REPOSITORIO
   \`\`\`

2. **Instale as dependências:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure as Variáveis de Ambiente:**
   Copie o arquivo de exemplo e preencha as chaves da API (Gemini e Supabase):
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Inicie o servidor de desenvolvimento:**
   \`\`\`bash
   npm run dev
   \`\`\`
   O aplicativo estará disponível em \`http://localhost:3000\` ou na porta padrão do Vite.

## Build para Produção
Para criar a versão otimizada de produção, execute:
\`\`\`bash
npm run build
\`\`\`
A pasta \`dist/\` será gerada com os arquivos estáticos prontos para implantação (Vercel, Netlify, Cloudflare Pages, etc.).


import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatSession } from '@google/genai';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';
import GalleryView from './GalleryView';
import { Message, Role, MediaType, GeneratedMedia } from '../types';
import { createChatSession, generateImageService, generateVideoService } from '../services/geminiService';

interface EcosystemProps {
  onLogout: () => void;
}

const Ecosystem: React.FC<EcosystemProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [gallery, setGallery] = useState<GeneratedMedia[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'gallery'>('chat');

  // Initialize Chat Session on mount
  useEffect(() => {
    startNewChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewChat = () => {
    try {
      const session = createChatSession();
      setChatSession(session);
      setMessages([]);
      setSidebarOpen(false);
      setCurrentView('chat'); // Reset to chat view on new chat
    } catch (e) {
      console.error("Failed to init chat:", e);
      addSystemMessage("Erro ao inicializar o sistema. Verifique sua chave API.");
    }
  };

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, { id: uuidv4(), role: Role.MODEL, text }]);
  };

  // Helper to convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/png;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleToolCalls = async (toolCalls: any[]): Promise<any> => {
    const functionResponses = [];

    for (const call of toolCalls) {
      const { name, args, id } = call;
      let result = {};

      // -----------------------------
      // 1. GEMINI FLOW (Orchestrator)
      // -----------------------------
      if (name === 'run_gemini_flow') {
          setMessages(prev => [...prev, { 
              id: uuidv4(), 
              role: Role.MODEL, 
              text: `🌊 GEMINI FLOW ATIVADO\n\nCampanha: ${args.campaignName}\nEstratégia: ${args.strategySummary}\n\nIniciando produção de assets em sequência...` 
          }]);

          // 1.1 Process Copywriting
          if (args.copywriting) {
              const copyText = `📝 **Sugestão de Copy:**\n\n**${args.copywriting.headline || 'Headline'}**\n\n${args.copywriting.body || ''}\n\n${args.copywriting.hashtags || ''}`;
               setMessages(prev => [...prev, { 
                  id: uuidv4(), 
                  role: Role.MODEL, 
                  text: copyText 
              }]);
          }

          // 1.2 Process Visual Assets Loop
          let assetsCreated = 0;
          if (args.visualAssets && Array.isArray(args.visualAssets)) {
              for (const asset of args.visualAssets) {
                  try {
                      if (asset.type === 'image') {
                          setMessages(prev => [...prev, { 
                              id: uuidv4(), role: Role.MODEL, text: `⏳ Flow: Gerando Imagem (${assetsCreated + 1}/${args.visualAssets.length})...` 
                          }]);
                          
                          const url = await generateImageService(asset.prompt, asset.aspectRatio || "1:1");
                          const newMedia: GeneratedMedia = {
                            id: uuidv4(), type: MediaType.IMAGE, url, prompt: asset.prompt, timestamp: Date.now()
                          };
                          setGallery(prev => [newMedia, ...prev]);
                          setMessages(prev => [...prev, { id: uuidv4(), role: Role.MODEL, text: "✅ Imagem pronta:", media: newMedia }]);
                          
                      } else if (asset.type === 'video') {
                          setMessages(prev => [...prev, { 
                              id: uuidv4(), role: Role.MODEL, text: `⏳ Flow: Gerando Vídeo Veo (${assetsCreated + 1}/${args.visualAssets.length})...` 
                          }]);
                          
                          const url = await generateVideoService(asset.prompt);
                          const newMedia: GeneratedMedia = {
                            id: uuidv4(), type: MediaType.VIDEO, url, prompt: asset.prompt, timestamp: Date.now()
                          };
                          setGallery(prev => [newMedia, ...prev]);
                          setMessages(prev => [...prev, { id: uuidv4(), role: Role.MODEL, text: "✅ Vídeo pronto:", media: newMedia }]);
                      }
                      assetsCreated++;
                  } catch (err) {
                      console.error("Flow Asset Error:", err);
                      setMessages(prev => [...prev, { id: uuidv4(), role: Role.MODEL, text: `❌ Erro ao gerar asset do Flow: ${asset.prompt}` }]);
                  }
              }
          }
          
          result = { result: `Flow complete. Generated ${assetsCreated} assets.` };
          setMessages(prev => [...prev, { id: uuidv4(), role: Role.MODEL, text: `✨ Gemini Flow finalizado com sucesso.` }]);
      }
      
      // -----------------------------
      // 2. GENERATE IMAGE (Standard)
      // -----------------------------
      else if (name === 'generate_image') {
        setMessages(prev => [...prev, { 
            id: uuidv4(), 
            role: Role.MODEL, 
            text: `🎨 Criando imagem para: "${args.prompt}"...` 
        }]);

        try {
          const url = await generateImageService(args.prompt, args.aspectRatio || "1:1");
          
          const newMedia: GeneratedMedia = {
            id: uuidv4(), type: MediaType.IMAGE, url, prompt: args.prompt, timestamp: Date.now()
          };
          setGallery(prev => [newMedia, ...prev]);

          setMessages(prev => [...prev, {
            id: uuidv4(), role: Role.MODEL, text: `Aqui está sua imagem! 📸`, media: newMedia
          }]);
          
          result = { result: "Image generated successfully." };
        } catch (e) {
            console.error(e);
            result = { error: "Failed to generate image." };
            addSystemMessage("Desculpe, tive um problema ao gerar a imagem.");
        }
      } 
      // -----------------------------
      // 3. GENERATE VIDEO (Standard)
      // -----------------------------
      else if (name === 'generate_video') {
         setMessages(prev => [...prev, { 
            id: uuidv4(), 
            role: Role.MODEL, 
            text: `🎬 Iniciando produção do vídeo (Veo)... Isso pode levar alguns minutos.` 
        }]);

        try {
            const url = await generateVideoService(args.prompt);
            const newMedia: GeneratedMedia = {
                id: uuidv4(), type: MediaType.VIDEO, url, prompt: args.prompt, timestamp: Date.now()
            };
            setGallery(prev => [newMedia, ...prev]);

            setMessages(prev => [...prev, {
                id: uuidv4(), role: Role.MODEL, text: `Seu vídeo está pronto! 🎥`, media: newMedia
            }]);

            result = { result: "Video generated successfully." };
        } catch (e) {
            console.error(e);
            handleVideoError(e);
            result = { error: "Failed to generate video." };
        }
      }
      // -----------------------------
      // 4. COMPOSE IMAGE (Fusion)
      // -----------------------------
      else if (name === 'compose_image') {
          setMessages(prev => [...prev, { 
            id: uuidv4(), 
            role: Role.MODEL, 
            text: `🖼️ IMAGE FUSION: Compondo "${args.elementDescription}" em cena "${args.scenePrompt}"...` 
        }]);

        try {
          const fusionPrompt = `Professional product photography composition. SUBJECT: ${args.elementDescription}. BACKGROUND: ${args.scenePrompt}. High resolution, realistic lighting, raytracing, 8k, seamless integration.`;
          
          const url = await generateImageService(fusionPrompt, "1:1");
          
          const newMedia: GeneratedMedia = {
            id: uuidv4(), type: MediaType.IMAGE, url, prompt: `FUSION: ${args.elementDescription} + ${args.scenePrompt}`, timestamp: Date.now()
          };
          setGallery(prev => [newMedia, ...prev]);

          setMessages(prev => [...prev, {
            id: uuidv4(), role: Role.MODEL, text: `Composição Finalizada: ${args.elementDescription} integrado. ✨`, media: newMedia
          }]);
          
          result = { result: "Composition generated successfully." };
        } catch (e) {
            console.error(e);
            result = { error: "Failed to compose image." };
            addSystemMessage("Falha na composição visual.");
        }
      }
      // -----------------------------
      // 5. COMPOSE MOTION SCENE (Fusion)
      // -----------------------------
      else if (name === 'compose_motion_scene') {
        setMessages(prev => [...prev, { 
            id: uuidv4(), 
            role: Role.MODEL, 
            text: `🎬 MOTION FUSION: Integrando "${args.elementDescription}" em cena dinâmica "${args.scenePrompt}"...` 
        }]);

        try {
            const fusionPrompt = `Cinematic video shot. SUBJECT: ${args.elementDescription}. SCENE: ${args.scenePrompt}. Professional lighting, 4k, slow motion, seamless product placement.`;
            
            const url = await generateVideoService(fusionPrompt);
            const newMedia: GeneratedMedia = {
                id: uuidv4(), type: MediaType.VIDEO, url, prompt: `FUSION: ${args.elementDescription} + ${args.scenePrompt}`, timestamp: Date.now()
            };
            setGallery(prev => [newMedia, ...prev]);

            setMessages(prev => [...prev, {
                id: uuidv4(), role: Role.MODEL, text: `Cena Motion Finalizada. 📽️`, media: newMedia
            }]);

            result = { result: "Motion scene generated successfully." };
        } catch (e) {
            console.error(e);
            handleVideoError(e);
            result = { error: "Failed to compose motion scene." };
        }
      }

      functionResponses.push({
        id,
        name,
        response: result,
      });
    }

    return { functionResponses };
  };

  const handleVideoError = (e: any) => {
    const errMsg = e instanceof Error ? e.message : "Unknown error";
    if (errMsg.includes("Selected API key")) {
        addSystemMessage("Para gerar vídeos, você precisa selecionar uma chave API paga. Por favor, tente novamente e selecione a chave.");
    } else {
        addSystemMessage("Desculpe, falha ao gerar o vídeo. Tente novamente.");
    }
  };

  const handleSendMessage = useCallback(async (text: string, attachment?: File) => {
    if (!chatSession) return;

    // 1. Prepare User Message for UI
    let attachmentData = undefined;
    if (attachment) {
        attachmentData = {
            url: URL.createObjectURL(attachment),
            type: attachment.type.startsWith('video') ? 'video' : 'image' as const,
        };
    }

    const userMsg: Message = { 
        id: uuidv4(), 
        role: Role.USER, 
        text,
        attachment: attachmentData
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      // 2. Construct Payload for Gemini
      let messagePayload: any = text;

      if (attachment) {
          const base64 = await fileToBase64(attachment);
          const mimeType = attachment.type;
          
          // Using 'parts' array for multimodal input in chat
          messagePayload = [
              { text: text || " " }, // Text part (ensure not empty)
              { 
                  inlineData: { 
                      mimeType: mimeType, 
                      data: base64 
                  } 
              }
          ];
      }

      // 3. Send to Gemini
      let result = await chatSession.sendMessage({ message: messagePayload });
      
      // Handle Tool Calls
      const candidate = result.candidates?.[0];
      const part = candidate?.content?.parts?.[0];

      if (part && 'functionCalls' in part && part.functionCalls) {
         const toolResponse = await handleToolCalls(part.functionCalls);
         // If a flow was executed, we still send the response back to close the turn
         result = await chatSession.sendToolResponse(toolResponse);
      }

      // Add Model Response (Text) - Only if text exists and it wasn't just a flow trigger that already added msgs
      const responseText = result.text;
      if (responseText) {
        setMessages(prev => [...prev, { id: uuidv4(), role: Role.MODEL, text: responseText }]);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      addSystemMessage("Desculpe, ocorreu um erro ao processar sua solicitação.");
    } finally {
      setIsThinking(false);
    }
  }, [chatSession]);

  return (
    <div className="flex h-screen w-full bg-dark-bg text-slate-200">
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onNewChat={startNewChat}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300">
        {/* Mobile Header Toggle */}
        <div className="md:hidden h-16 bg-dark-card border-b border-slate-700 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center">
                    <i className="fa-solid fa-layer-group text-white text-xs"></i>
                 </div>
                 <span className="font-bold text-white tracking-wide">MKT4IA</span>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="text-white p-2">
                <i className="fa-solid fa-bars text-xl"></i>
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 h-full overflow-hidden relative">
            {currentView === 'chat' ? (
                <ChatInterface 
                    messages={messages} 
                    isThinking={isThinking} 
                    onSendMessage={handleSendMessage} 
                />
            ) : (
                <GalleryView gallery={gallery} />
            )}
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;

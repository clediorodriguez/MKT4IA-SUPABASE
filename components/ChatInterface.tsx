import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, MediaType } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isThinking: boolean;
  onSendMessage: (text: string, attachment?: File) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isThinking, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachment(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || isThinking) return;
    
    onSendMessage(input, attachment || undefined);
    
    setInput('');
    clearAttachment();
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg text-slate-200">
      {/* Top Bar Header */}
      <div className="h-20 border-b border-slate-700 flex items-center justify-between px-6 bg-dark-bg/95 backdrop-blur z-10 sticky top-0">
         <div className="flex items-center gap-4">
             <div className="relative">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <i className="fa-solid fa-paintbrush text-white text-lg"></i>
                 </div>
                 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-dark-bg rounded-full"></div>
             </div>
             <div>
                 <h2 className="text-sm font-bold text-white tracking-wide">MKT4IA-DESIGNER</h2>
                 <p className="text-xs text-brand-400 font-medium">Especialista em Marketing Óptico</p>
             </div>
         </div>
         <div className="hidden md:flex gap-2 text-slate-500 text-xs font-mono bg-dark-input px-3 py-1 rounded-full border border-slate-700">
             <span>v1.0</span>
             <span className="text-slate-700">|</span>
             <span className="text-green-400">Online</span>
         </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60 px-4 py-8">
            
            <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-brand-500/20 animate-fade-in ring-4 ring-brand-500/10">
                <i className="fa-solid fa-pen-ruler text-5xl text-white"></i>
            </div>
            
            <h2 className="text-3xl font-bold mb-3 text-white tracking-tight text-center">MKT4IA-DESIGNER</h2>
            <p className="text-center mb-10 text-slate-400 max-w-lg text-base leading-relaxed">
              Olá. Sou seu Especialista em Design e Marketing Óptico. <br/>
              Envie uma foto do seu produto para começarmos a criar!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                {/* Agent Card: Designer */}
                <div className="bg-dark-card border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:border-brand-500/50 transition-colors group cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
                        <i className="fa-solid fa-palette text-lg"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-200 text-sm group-hover:text-white">Design Visual</h4>
                        <p className="text-xs text-slate-500">Posts, Stories e Vitrines</p>
                    </div>
                </div>

                {/* Agent Card: Video Creator */}
                <div className="bg-dark-card border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:border-purple-500/50 transition-colors group cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                        <i className="fa-solid fa-clapperboard text-lg"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-200 text-sm group-hover:text-white">Vídeo Marketing</h4>
                        <p className="text-xs text-slate-500">Roteiros e Geração Veo</p>
                    </div>
                </div>

                {/* Agent Card: Copywriter */}
                <div className="bg-dark-card border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:border-yellow-500/50 transition-colors group cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                        <i className="fa-solid fa-font text-lg"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-200 text-sm group-hover:text-white">Copywriting</h4>
                        <p className="text-xs text-slate-500">Legendas e Campanhas</p>
                    </div>
                </div>

                {/* Agent Card: Strategy */}
                <div className="bg-dark-card border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:border-green-500/50 transition-colors group cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                        <i className="fa-solid fa-bullseye text-lg"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-200 text-sm group-hover:text-white">Estratégia</h4>
                        <p className="text-xs text-slate-500">Planejamento Óptico</p>
                    </div>
                </div>
            </div>
            
            <p className="mt-8 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                Designer v1.0 • Ready for creation
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === Role.USER ? 'items-end' : 'items-start'}`}>
                {msg.role === Role.MODEL && (
                    <span className="text-[10px] text-slate-500 mb-1 ml-1 font-semibold uppercase tracking-wider">MKT4IA Designer</span>
                )}
                <div
                className={`rounded-2xl p-5 shadow-lg relative ${
                    msg.role === Role.USER
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-dark-card border border-slate-700 text-slate-200 rounded-bl-none'
                }`}
                >
                {/* User Attachment Display */}
                {msg.attachment && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                        {msg.attachment.type === 'image' ? (
                            <img src={msg.attachment.url} alt="User upload" className="max-h-[200px] w-auto object-cover" />
                        ) : (
                            <div className="bg-black/50 p-4 flex items-center gap-2">
                                <i className="fa-solid fa-video"></i> Video attached
                            </div>
                        )}
                    </div>
                )}

                {/* Text Content */}
                <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                    {msg.text}
                </div>

                {/* Generated Media Content */}
                {msg.media && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-slate-600 bg-black/50">
                    {msg.media.type === MediaType.IMAGE ? (
                        <div className="relative group">
                            <img src={msg.media.url} alt={msg.media.prompt} className="w-full h-auto object-cover max-h-[400px]" />
                            <a href={msg.media.url} download className="absolute bottom-2 right-2 w-8 h-8 bg-black/60 text-white flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-500">
                                <i className="fa-solid fa-download text-xs"></i>
                            </a>
                        </div>
                    ) : (
                        <video src={msg.media.url} controls className="w-full h-auto max-h-[400px]" />
                    )}
                    <div className="p-3 bg-slate-800/80 backdrop-blur text-xs text-slate-400 italic border-t border-slate-600">
                        <span className="font-semibold text-brand-400">Prompt:</span> {msg.media.prompt}
                    </div>
                    </div>
                )}
                </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start w-full">
            <div className="bg-dark-card border border-slate-700 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-xs text-slate-400 animate-pulse font-medium">Designer criando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-dark-card border-t border-slate-700">
        
        {/* Attachment Preview */}
        {previewUrl && (
            <div className="max-w-4xl mx-auto mb-2 flex items-center gap-3 animate-fade-in">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-brand-500 group">
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button 
                        onClick={clearAttachment}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <span className="text-xs text-brand-400 font-medium">Imagem anexada para composição</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto bg-dark-input rounded-2xl p-2 pr-2 border border-slate-600 focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${attachment ? 'text-brand-400 bg-brand-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            title="Anexar imagem do produto"
          >
            <i className="fa-solid fa-paperclip"></i>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descreva a imagem, vídeo ou texto que você precisa..."
            className="flex-1 bg-transparent text-white border-none focus:outline-none px-2 py-2 placeholder-slate-500"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={isThinking || (!input.trim() && !attachment)}
            className="bg-gradient-to-tr from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white rounded-xl w-12 h-12 transition-all flex items-center justify-center shadow-lg shadow-brand-500/20"
          >
            {isThinking ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
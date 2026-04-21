import React, { useState } from 'react';
import { GeneratedMedia, MediaType } from '../types';

interface GalleryViewProps {
  gallery: GeneratedMedia[];
}

const GalleryView: React.FC<GalleryViewProps> = ({ gallery }) => {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

  const filteredGallery = gallery.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="flex flex-col h-full bg-dark-bg text-slate-200">
      {/* Header */}
      <div className="h-20 border-b border-slate-700 flex items-center justify-between px-6 bg-dark-bg/95 backdrop-blur z-10 sticky top-0">
        <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-images text-brand-500"></i>
                Galeria de Assets
            </h2>
            <p className="text-xs text-slate-400">Gerencie as mídias criadas pelos agentes</p>
        </div>
        
        <div className="flex bg-dark-input rounded-lg p-1 border border-slate-600">
            <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Todos
            </button>
            <button 
                onClick={() => setFilter('image')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'image' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Imagens
            </button>
            <button 
                onClick={() => setFilter('video')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'video' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Vídeos
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {gallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
             <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <i className="fa-regular fa-folder-open text-2xl"></i>
             </div>
             <p>Nenhuma mídia gerada ainda.</p>
             <p className="text-sm">Inicie uma conversa no Studio para criar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGallery.map((media) => (
              <div key={media.id} className="group bg-dark-card border border-slate-700 rounded-xl overflow-hidden hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-500/10 flex flex-col">
                <div className="relative aspect-square bg-slate-900 overflow-hidden">
                   {media.type === MediaType.IMAGE ? (
                    <img 
                        src={media.url} 
                        alt={media.prompt} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <video 
                        src={media.url} 
                        className="w-full h-full object-cover"
                        controls
                    />
                  )}
                  {media.type === MediaType.IMAGE && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <a 
                            href={media.url} 
                            download={`mkt4ia-image-${media.id}.png`}
                            className="w-10 h-10 rounded-full bg-white text-brand-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors"
                            title="Download"
                        >
                            <i className="fa-solid fa-download"></i>
                        </a>
                        <a 
                            href={media.url} 
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-brand-500 transition-colors"
                            title="Visualizar"
                        >
                            <i className="fa-solid fa-expand"></i>
                        </a>
                      </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${media.type === MediaType.VIDEO ? 'bg-red-500/20 text-red-400' : 'bg-pink-500/20 text-pink-400'}`}>
                            {media.type === MediaType.VIDEO ? 'Video' : 'Image'}
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                            {new Date(media.timestamp).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 italic" title={media.prompt}>
                        "{media.prompt}"
                    </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;
import React from 'react';

interface SidebarProps {
  currentView: 'chat' | 'gallery';
  onViewChange: (view: 'chat' | 'gallery') => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onNewChat: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, toggleSidebar, onNewChat, onLogout }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-dark-card border-r border-slate-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col h-full shadow-2xl`}
      >
        {/* Brand Header */}
        <div className="p-6 h-20 flex items-center gap-3 border-b border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <i className="fa-solid fa-layer-group text-white text-lg"></i>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wide text-white leading-none">MKT4IA</h1>
            <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-widest">DESIGNER v1.0</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden ml-auto text-slate-400">
             <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <div className="mb-8">
                <button 
                    onClick={onNewChat}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-95 group"
                >
                    <i className="fa-solid fa-plus transition-transform group-hover:rotate-90"></i>
                    <span>Nova Criação</span>
                </button>
            </div>

            <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>
            
            <button 
                onClick={() => { onViewChange('chat'); if(window.innerWidth < 768) toggleSidebar(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === 'chat' 
                    ? 'bg-slate-700/50 text-brand-400 border border-slate-600/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
                <i className={`fa-solid fa-comments w-5 text-center ${currentView === 'chat' ? 'text-brand-400' : ''}`}></i>
                <span className="font-medium">Studio Criativo</span>
                {currentView === 'chat' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
            </button>

            <button 
                onClick={() => { onViewChange('gallery'); if(window.innerWidth < 768) toggleSidebar(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === 'gallery' 
                    ? 'bg-slate-700/50 text-brand-400 border border-slate-600/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
                <i className={`fa-solid fa-images w-5 text-center ${currentView === 'gallery' ? 'text-brand-400' : ''}`}></i>
                <span className="font-medium">Galeria de Assets</span>
                {currentView === 'gallery' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
            </button>
        </div>

        {/* User Account / Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/20">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-brand-500/30 transition-colors cursor-pointer group mb-2">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 border border-slate-600 group-hover:border-brand-500 transition-colors">
                <i className="fa-solid fa-user"></i>
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-brand-400 transition-colors">Minha Conta</p>
                <p className="text-xs text-slate-500">MKT4IA Pro</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-2 text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LoginScreenProps {
  onSuccess: (mockEmail?: string) => void;
  onCancel: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Bypass para testes rápidos ou esquecimento de senha
    if (password === 'teste123' || email === 'clediorodriguez@hotmail.com') {
        setTimeout(() => {
            onSuccess(email || 'clediorodriguez@hotmail.com');
        }, 800);
        return;
    }

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        onSuccess();
    } catch (error: any) {
        console.error(error);
        setErrorMsg(error.message || "Falha ao realizar login.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-bg z-50 flex items-center justify-center p-6">
        <button onClick={onCancel} className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>

        <div className="w-full max-w-md">
            <div className="text-center mb-10">
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/20">
                    <i className="fa-solid fa-layer-group text-white text-3xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Login MKT4IA</h2>
                <p className="text-slate-400">Acesse o ecossistema criativo</p>
            </div>

            <div className="bg-dark-card border border-slate-700 rounded-2xl p-8 shadow-2xl">
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                        {errorMsg}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-dark-input border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Senha</label>
                        </div>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-dark-input border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                    >
                        {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Entrar na Plataforma'}
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default LoginScreen;
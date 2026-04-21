import React from 'react';
import { PLANS_CONFIG } from '../constants';
import { PlanTier } from '../types';

interface LandingPageProps {
  onSelectPlan: (plan: PlanTier) => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectPlan, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-200 overflow-y-auto font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-dark-bg/90 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center">
             <i className="fa-solid fa-layer-group text-white text-xs"></i>
          </div>
          <span className="font-bold text-white tracking-wide text-lg">MKT4IA</span>
        </div>
        <button 
          onClick={onLoginClick}
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors border border-slate-700"
        >
          <i className="fa-solid fa-lock mr-2 text-xs"></i>
          Área de Membros
        </button>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-400 text-xs font-bold uppercase tracking-widest mb-6">
            Novo Ecossistema 2.0
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Sua Agência de Marketing <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">
            Powered by Artificial Intelligence
          </span>
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Tenha um time completo: Diretor Criativo, Designer, Videomaker e Copywriter trabalhando 24/7 para sua Ótica, Laboratório ou Clínica.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
             onClick={() => document.getElementById('plans')?.scrollIntoView({behavior: 'smooth'})}
             className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transform hover:-translate-y-1"
          >
            Ver Planos e Preços
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Escolha seu Plano</h2>
              <p className="text-slate-400">Assinatura flexível. Cancele quando quiser.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Loop through plans */}
            {(Object.keys(PLANS_CONFIG) as PlanTier[]).map((tier) => {
                const plan = PLANS_CONFIG[tier];
                const isPopular = 'popular' in plan && plan.popular;
                const isPlatinum = tier === 'Platinum';
                
                // Calculate discounted price for display (10% off for Pix Monthly)
                const discountedPrice = (plan.price * 0.90).toFixed(2).replace('.', ',');

                return (
                    <div 
                        key={tier}
                        className={`relative bg-dark-card border rounded-2xl p-6 flex flex-col transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl ${
                            isPopular 
                            ? 'border-brand-500 shadow-brand-500/10 ring-1 ring-brand-500/50' 
                            : isPlatinum 
                                ? 'border-slate-600 bg-gradient-to-b from-slate-800 to-slate-900' 
                                : 'border-slate-700 hover:border-slate-600'
                        }`}
                    >
                        {isPopular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                Recomendado
                            </div>
                        )}

                        <h3 className={`text-lg font-bold mb-2 ${isPlatinum ? 'text-slate-200' : 'text-white'}`}>{plan.name}</h3>
                        
                        <div className="mb-4">
                            <div className="text-3xl font-bold text-white leading-none">
                                R$ {plan.price.toFixed(2).replace('.', ',')}
                                <span className="text-sm text-slate-500 font-normal">/mês</span>
                            </div>
                            
                            {/* Discount Highlight */}
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                                <i className="fa-brands fa-pix"></i>
                                <span>ou R$ {discountedPrice} à vista</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 mb-6 font-mono">
                            {plan.credits} créditos mensais
                        </p>

                        <button 
                            onClick={() => onSelectPlan(tier)}
                            className={`w-full py-3 rounded-xl font-bold text-sm mb-8 transition-all ${
                                isPopular
                                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            }`}
                        >
                            Assinar {plan.name}
                        </button>

                        <ul className="space-y-3 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                    <i className={`fa-solid fa-check mt-1 ${isPopular ? 'text-brand-400' : 'text-green-500'}`}></i>
                                    <span className="leading-tight">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}

          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-slate-600 text-sm border-t border-slate-800 bg-dark-card">
        <p>&copy; 2025 MKT4IA. Todos os direitos reservados.</p>
        <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
            <span>Termos de Uso</span>
            <span>Privacidade</span>
            <span>Suporte</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
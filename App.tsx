import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CheckoutGateway from './components/CheckoutGateway';
import LoginScreen from './components/LoginScreen';
import Ecosystem from './components/Ecosystem';
import { PlanTier, UserProfile } from './types';
import { supabase } from './lib/supabaseClient';
import { PLANS_CONFIG } from './constants';

type ViewState = 'landing' | 'checkout' | 'login' | 'ecosystem';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('Gold');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check Active Session & URL Params on Mount
  useEffect(() => {
    const checkSessionAndParams = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // If logged in, go to ecosystem
        await fetchUserProfile(session.user.id, session.user.email!);
      } else {
        // If NOT logged in, check URL params for deep linking (e.g. ?plano=bronze)
        handleURLParams();
        setIsLoading(false);
      }
    };

    checkSessionAndParams();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email!);
      } else {
        setCurrentUser(null);
        setCurrentView('landing');
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper to parse URL params
  const handleURLParams = () => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plano'); // 'bronze', 'silver', etc.

    if (planParam) {
        // Normalize string: "bronze" -> "Bronze"
        const formattedPlan = planParam.charAt(0).toUpperCase() + planParam.slice(1).toLowerCase();

        // Check if it matches a valid plan key
        if (Object.keys(PLANS_CONFIG).includes(formattedPlan)) {
            setSelectedPlan(formattedPlan as PlanTier);
            setCurrentView('checkout');
            
            // Optional: Clean URL so a refresh doesn't stick on checkout
            // window.history.replaceState({}, '', window.location.pathname);
        }
    }
  };

  // Fetch extra data from 'profiles' table
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setCurrentUser({
            ...data,
            // Ensure compatibility if DB fields vary slightly
            email: email
        });
        setCurrentView('ecosystem');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback/Simulated Login if DB fails (Demo Mode)
      // In production, force logout or show error. For demo, we allow entry.
      setCurrentUser({
          id: userId,
          email: email,
          name: 'Usuário Demo',
          plano: 'Gold',
          status_assinatura: 'ativa',
          renovacao_em: new Date().toISOString(),
          gateway_customer_id: 'cus_demo',
          creditos: 1000,
          createdAt: new Date().toISOString()
      });
      setCurrentView('ecosystem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: PlanTier) => {
    setSelectedPlan(plan);
    setCurrentView('checkout');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-brand-500">
        <i className="fa-solid fa-circle-notch animate-spin text-4xl"></i>
      </div>
    );
  }

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage 
            onSelectPlan={handleSelectPlan} 
            onLoginClick={() => setCurrentView('login')}
        />
      )}

      {currentView === 'checkout' && (
        <CheckoutGateway 
            planTier={selectedPlan}
            onSuccess={() => {
                // Supabase Auth listener will catch the new session and redirect to ecosystem
            }}
            onCancel={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'login' && (
        <LoginScreen 
            onSuccess={(mockEmail?: string) => {
                 if (mockEmail) {
                     // Utiliza o modo mock de login caso o Supabase seja bypassado
                     fetchUserProfile('mock_test_id', mockEmail);
                 }
            }}
            onCancel={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'ecosystem' && currentUser && (
        <Ecosystem onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
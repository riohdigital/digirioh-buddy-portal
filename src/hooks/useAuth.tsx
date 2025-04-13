
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, saveGoogleTokens } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Verifica se deve salvar tokens do Google após login ou refresh de token
        if (currentSession?.provider_token && currentSession?.user && 
            (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          try {
            console.log('AuthProvider: Tentando salvar tokens do Google para user:', currentSession.user.id);
            await saveGoogleTokens({ 
              accessToken: currentSession.provider_token, 
              refreshToken: currentSession.provider_refresh_token || null 
            });
            console.log('AuthProvider: Tokens do Google salvos com sucesso (ou tentativa enviada).');
          } catch (error) {
            console.error('AuthProvider: Erro ao tentar salvar tokens do Google:', error);
          }
        }
        
        if (event === 'SIGNED_IN' && currentSession) {
          console.log("Usuário autenticado, redirecionando para dashboard");
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          console.log("Usuário deslogado, redirecionando para página inicial");
          navigate('/');
        }
      }
    );

    // Verificar sessão existente
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      if (currentSession?.user) {
        console.log("Sessão ativa encontrada para:", currentSession.user.id);
      }
    };
    
    checkSession();

    // Limpar subscription quando componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignInWithGoogle = async () => {
    try {
      console.log("Iniciando login com Google do hook...");
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: 'https://mail.google.com/ https://www.googleapis.com/auth/calendar.events',
        },
      });
    } catch (error) {
      console.error("Erro no login com Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

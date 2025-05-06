import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithGoogle as signInWithGoogleFromLib, saveGoogleTokens } from '@/lib/supabase';
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
  const tokensSavedForSessionRef = useRef<string | null>(null);
  const isMountedRef = useRef(true); // Referência para controlar o estado de montagem

  useEffect(() => {
    isMountedRef.current = true;

    const attemptToSaveTokens = async (currentSession: Session | null, eventType: string) => {
      if (!isMountedRef.current) return;
      if (
        currentSession?.provider_token &&
        currentSession.user &&
        tokensSavedForSessionRef.current !== currentSession.access_token
      ) {
        console.log(`AuthProvider (${eventType}): Novos tokens do provedor detectados. Tentando salvar...`);
        console.log(` - Access Token Session: ${currentSession.provider_token ? 'Presente' : 'Ausente'}`);
        console.log(` - Refresh Token Session: ${currentSession.provider_refresh_token ? 'Presente' : 'Ausente'}`);
        try {
          await saveGoogleTokens({
            accessToken: currentSession.provider_token,
            refreshToken: currentSession.provider_refresh_token || null,
          });
          if (isMountedRef.current) {
            tokensSavedForSessionRef.current = currentSession.access_token;
          }
          console.log(`AuthProvider (${eventType}): Chamada para salvar tokens enviada com sucesso.`);
        } catch (error) {
          console.error(`AuthProvider (${eventType}): Erro ao tentar salvar tokens do Google:`, error);
        }
      } else if (currentSession?.provider_token && currentSession.user) {
        console.log(`AuthProvider (${eventType}): Tokens já salvos para este access_token ou provider_token ausente.`);
      } else {
        console.log(`AuthProvider (${eventType}): Sem tokens do provedor na sessão atual para salvar.`);
      }
    };

    // Verificar sessão existente ao montar primeiro
    const checkInitialSession = async () => {
      try {
        console.log("AuthProvider: Verificando sessão inicial (checkInitialSession)...");
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (!isMountedRef.current) return;

        if (sessionError) {
          console.error("AuthProvider: Erro ao obter sessão inicial:", sessionError);
          setLoading(false);
          return;
        }

        console.log("AuthProvider (checkInitialSession): Sessão obtida:", initialSession?.user?.id);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          console.log("AuthProvider (checkInitialSession): Sessão ativa inicial encontrada para:", initialSession.user.id);
          await attemptToSaveTokens(initialSession, 'INITIAL_SESSION_CHECK');
        } else {
          console.log("AuthProvider (checkInitialSession): Nenhuma sessão ativa inicial encontrada.");
        }
      } catch (error) {
        console.error("AuthProvider: Erro inesperado ao verificar sessão:", error);
      } finally {
        // Sempre definir loading como false após verificar a sessão inicial
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Iniciar verificação da sessão
    checkInitialSession();

    // Listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMountedRef.current) return;

        console.log("Auth state changed (listener):", event, "Session User ID:", currentSession?.user?.id);
        
        // Atualizar o estado com a nova sessão e usuário
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await attemptToSaveTokens(currentSession, `LISTENER_${event}`);
        }

        if (event === 'SIGNED_OUT') {
          console.log("Usuário deslogado (listener), redirecionando para página inicial");
          tokensSavedForSessionRef.current = null;
          navigate('/');
        }
        
        // Garantir que loading seja falso após qualquer mudança de estado de autenticação
        setLoading(false);
      }
    );

    return () => {
      isMountedRef.current = false;
      console.log("AuthProvider: Desinscrevendo listener de autenticação.");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignInWithGoogle = async () => {
    try {
      console.log("AuthProvider: Chamando signInWithGoogle de lib/supabase...");
      await signInWithGoogleFromLib();
    } catch (error) {
      console.error("AuthProvider: Erro ao iniciar o fluxo de login com Google:", error);
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      if (isMountedRef.current) {
        tokensSavedForSessionRef.current = null;
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      if (isMountedRef.current) setLoading(false);
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
      {loading ? (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
           <p>Carregando aplicação...</p>
         </div>
      ) : children}
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

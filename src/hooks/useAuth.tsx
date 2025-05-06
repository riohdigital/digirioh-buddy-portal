import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithGoogle as signInWithGoogleFromLib, saveGoogleTokens } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// ... (AuthContextType e createContext continuam os mesmos) ...
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
  const [loading, setLoading] = useState(true); // Inicia como true
  const navigate = useNavigate();
  const tokensSavedForSessionRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const attemptToSaveTokens = async (currentSession: Session | null, eventType: string) => {
      if (!isMounted || !currentSession?.provider_token || !currentSession.user || tokensSavedForSessionRef.current === currentSession.access_token) {
        // Adiciona log se as condições não forem atendidas para salvar
        if (currentSession?.user) { // Só loga detalhes se houver sessão
            console.log(`AuthProvider (${eventType}): Condições para salvar tokens não atendidas ou já salvos. AccessTokenRef: ${tokensSavedForSessionRef.current}, CurrentAccessToken: ${currentSession?.access_token}`);
        }
        return;
      }

      console.log(`AuthProvider (${eventType}): Novos tokens do provedor detectados. Tentando salvar...`);
      console.log(` - Access Token Session: ${currentSession.provider_token ? 'Presente' : 'Ausente'}`);
      console.log(` - Refresh Token Session: ${currentSession.provider_refresh_token ? 'Presente' : 'Ausente'}`);
      try {
        await saveGoogleTokens({
          accessToken: currentSession.provider_token,
          refreshToken: currentSession.provider_refresh_token || null,
        });
        if (isMounted) {
          tokensSavedForSessionRef.current = currentSession.access_token;
        }
        console.log(`AuthProvider (${eventType}): Chamada para salvar tokens enviada com sucesso.`);
      } catch (error) {
        console.error(`AuthProvider (${eventType}): Erro ao tentar salvar tokens do Google:`, error);
        // Mesmo com erro no save, não queremos que a UI fique presa em loading para sempre.
      }
    };

    // Listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        console.log("Auth state changed (listener):", event, "Session User ID:", currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await attemptToSaveTokens(currentSession, `LISTENER_${event}`);
        }

        if (event === 'SIGNED_OUT') {
          console.log("Usuário deslogado (listener), limpando tokens salvos e navegando...");
          if (isMounted) {
            tokensSavedForSessionRef.current = null;
          }
          navigate('/');
        }
        // O setLoading(false) principal será feito pelo checkInitialSession.
        // O listener apenas atualiza o estado da sessão/usuário.
      }
    );

    // Verificar sessão existente ao montar
    const checkInitialSession = async () => {
      console.log("AuthProvider: Verificando sessão inicial (checkInitialSession)...");
      // Não seta loading true aqui, ele já começa como true.

      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          console.error("AuthProvider: Erro ao obter sessão inicial:", sessionError);
        }

        console.log("AuthProvider (checkInitialSession): Sessão obtida:", initialSession?.user?.id);
        setSession(initialSession); // Atualiza sessão antes de setar usuário
        setUser(initialSession?.user ?? null);


        if (initialSession?.user) {
          console.log("AuthProvider (checkInitialSession): Sessão ativa inicial encontrada para:", initialSession.user.id);
          await attemptToSaveTokens(initialSession, 'INITIAL_SESSION_CHECK');
        } else {
          console.log("AuthProvider (checkInitialSession): Nenhuma sessão ativa inicial encontrada.");
        }
      } catch (error) {
          console.error("AuthProvider (checkInitialSession): Erro catastrófico ao verificar sessão:", error);
      } finally {
          // Define loading como false APÓS toda a lógica de checkInitialSession ter rodado,
          // incluindo a tentativa de salvar tokens, mesmo que haja erro.
          if (isMounted) {
            console.log("AuthProvider (checkInitialSession): Finalizando verificação, definindo loading para false.");
            setLoading(false);
          }
      }
    };

    checkInitialSession();

    return () => {
      isMounted = false;
      console.log("AuthProvider: Desinscrevendo listener de autenticação.");
      subscription.unsubscribe();
    };
  }, [navigate]); // navigate é a única dependência estável aqui

  // ... (handleSignInWithGoogle e handleSignOut continuam os mesmos)
  const handleSignInWithGoogle = async () => {
    try {
      console.log("AuthProvider: Chamando signInWithGoogle de lib/supabase...");
      await signInWithGoogleFromLib();
    } catch (error) {
      console.error("AuthProvider: Erro ao iniciar o fluxo de login com Google:", error);
      // Se o login falhar no início, também precisamos parar o loading
      if (isMounted && loading) setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
        await supabase.auth.signOut();
        // tokensSavedForSessionRef já é limpo pelo evento SIGNED_OUT no listener
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
      {loading ? (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
           <p>Carregando aplicação...</p>
           {/* Adicione um spinner visual aqui, se tiver um componente */}
           {/* <YourSpinnerComponent /> */}
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

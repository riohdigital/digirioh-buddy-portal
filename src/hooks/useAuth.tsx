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
  const isMountedRef = useRef(true);
  
  console.log("AuthProvider: Componente renderizado/re-renderizado");
  console.log(`AuthProvider: Antes do return do Provider. Estado loading: ${loading}`);
  
  if (loading) {
    console.log("AuthProvider: Renderizando estado de 'Carregando'...");
  }

  // Função para garantir que o estado de loading seja consistentemente atualizado
  const finishLoading = () => {
    if (!isMountedRef.current) return;
    
    console.log("AuthProvider finishLoading: Finalizando o carregamento. isMounted:", isMountedRef.current);
    setLoading(false);
    console.log("AuthProvider finishLoading: Loading definido como FALSE");
  };

  // Salvamento de tokens em uma função separada
  const attemptToSaveTokens = async (currentSession: Session | null, eventType: string) => {
    console.log(`AuthProvider (${eventType}) LOG 0: attemptToSaveTokens chamado. isMounted:`, isMountedRef.current);
    if (!isMountedRef.current) return;
    
    const shouldSave = 
      currentSession?.provider_token &&
      currentSession.user &&
      tokensSavedForSessionRef.current !== currentSession.access_token;
    
    console.log(`AuthProvider (${eventType}) LOG 0.2: Verificando condições - provider_token: ${!!currentSession?.provider_token}, user: ${!!currentSession?.user}, tokenJáSalvo: ${tokensSavedForSessionRef.current === currentSession?.access_token}, Resultado shouldSave: ${shouldSave}`);
    
    if (shouldSave) {
      console.log(`AuthProvider (${eventType}) LOG 1: Condições para salvar atendidas. Tentando salvar... AccessToken: ${currentSession.provider_token.substring(0, 10)}..., RefreshToken: ${currentSession.provider_refresh_token ? 'Presente' : 'Ausente'}`);
      try {
        await saveGoogleTokens({
          accessToken: currentSession.provider_token,
          refreshToken: currentSession.provider_refresh_token || null,
        });
        if (isMountedRef.current) {
          tokensSavedForSessionRef.current = currentSession.access_token;
          console.log(`AuthProvider (${eventType}) LOG 2: Tokens salvos com sucesso.`);
        }
      } catch (error) {
        console.error(`AuthProvider (${eventType}) LOG 2-ERROR: Erro ao tentar salvar tokens do Google:`, error);
      }
    } else if (currentSession?.provider_token && currentSession.user) {
      console.log(`AuthProvider (${eventType}) LOG 1-ALT: Tokens já salvos ou condições não atendidas.`);
    } else {
      console.log(`AuthProvider (${eventType}) LOG 1-ALT: Sem tokens do provedor na sessão atual.`);
    }
  };

  useEffect(() => {
    console.log("AuthProvider useEffect: Montado. isMounted:", isMountedRef.current);
    isMountedRef.current = true;
    
    let authSubscription;

    // O listener de autenticação
    const setupAuthListener = () => {
      console.log("AuthProvider: Configurando listener de autenticação");
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log("AuthProvider onAuthStateChange LOG 3: Evento:", event, "UserID:", currentSession?.user?.id, "isMounted:", isMountedRef.current);
          
          if (!isMountedRef.current) {
            console.log("AuthProvider onAuthStateChange LOG 3-ABORT: Componente desmontado. Evento ignorado.");
            return;
          }

          // Atualizar o estado com a nova sessão e usuário
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log("AuthProvider onAuthStateChange LOG 4: Evento", event, "chamando attemptToSaveTokens.");
            await attemptToSaveTokens(currentSession, `LISTENER_${event}`);
          }

          if (event === 'SIGNED_OUT') {
            console.log("AuthProvider onAuthStateChange LOG 4-ALT: Usuário deslogado, redirecionando. isMounted:", isMountedRef.current);
            tokensSavedForSessionRef.current = null;
            navigate('/');
          }
          
          // Garantir que loading seja falso após qualquer evento de autenticação
          console.log("AuthProvider onAuthStateChange LOG 5: Após", event, "finalizando carregamento. isMounted:", isMountedRef.current);
          finishLoading();
        }
      );
      
      return subscription;
    };

    // Verificar sessão existente ao montar
    const checkInitialSession = async () => {
      try {
        console.log("AuthProvider checkInitialSession LOG 7: Iniciando. isMounted:", isMountedRef.current);
        console.log("AuthProvider checkInitialSession LOG 8: Chamando supabase.auth.getSession().");
        
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (!isMountedRef.current) {
          console.log("AuthProvider checkInitialSession LOG 9-ABORT: Componente desmontado durante a chamada.");
          return;
        }

        if (sessionError) {
          console.error("AuthProvider checkInitialSession LOG 9-ERROR: Erro ao obter sessão:", sessionError);
          finishLoading();
          return;
        }

        console.log("AuthProvider checkInitialSession LOG 9: Sessão obtida. UserID:", initialSession?.user?.id);
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          console.log("AuthProvider checkInitialSession LOG 10: Sessão ativa encontrada. UserID:", initialSession.user.id);
          await attemptToSaveTokens(initialSession, 'INITIAL_SESSION_CHECK');
        } else {
          console.log("AuthProvider checkInitialSession LOG 10-ALT: Nenhuma sessão ativa encontrada.");
        }
        
        // Importante: sempre finalize o loading aqui, independentemente do resultado
        finishLoading();
        
      } catch (error) {
        console.error("AuthProvider checkInitialSession LOG ERROR: Erro inesperado:", error);
        finishLoading(); // Garantir que o loading termine mesmo com erro
      }
    };

    // Primeiro configure o listener, depois verifique a sessão
    authSubscription = setupAuthListener();
    
    // Então verifique a sessão inicial (que agora deve sempre resultar em finishLoading)
    checkInitialSession();
    
    return () => {
      console.log("AuthProvider useEffect CLEANUP: Componente desmontando. Desativando isMounted e cancelando subscription.");
      isMountedRef.current = false;
      authSubscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignInWithGoogle = async () => {
    try {
      console.log("AuthProvider handleSignInWithGoogle: Iniciando login com Google. isMounted:", isMountedRef.current);
      setLoading(true);
      await signInWithGoogleFromLib();
      // O listener de autenticação cuidará de definir loading como false
    } catch (error) {
      console.error("AuthProvider handleSignInWithGoogle ERROR: Erro ao iniciar login:", error);
      if (isMountedRef.current) {
        console.log("AuthProvider handleSignInWithGoogle ERROR: Erro capturado, definindo loading=false");
        finishLoading();
      }
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("AuthProvider handleSignOut: Iniciando logout. isMounted:", isMountedRef.current);
      setLoading(true);
      await supabase.auth.signOut();
      // O listener de autenticação cuidará de definir loading como false
    } catch (error) {
      console.error("AuthProvider handleSignOut ERROR: Erro ao fazer logout:", error);
      if (isMountedRef.current) {
        console.log("AuthProvider handleSignOut ERROR: Erro capturado, definindo loading=false");
        finishLoading();
      }
    }
  };

  // Log explicativo para debug
  if (loading) {
    console.log("AuthProvider RENDER: Mostrar tela de loading...");
  } else {
    console.log("AuthProvider RENDER: Mostrando conteúdo da aplicação. User:", user?.id);
  }

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

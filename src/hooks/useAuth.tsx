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
  console.log("AuthProvider: Componente renderizado/re-renderizado");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const tokensSavedForSessionRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    console.log("AuthProvider useEffect: Montado. isMounted:", isMounted);

    const attemptToSaveTokens = async (currentSession: Session | null, eventType: string) => {
      console.log(`AuthProvider (${eventType}) LOG 0: attemptToSaveTokens chamado. isMounted: ${isMounted}`);
      if (!isMounted) {
        console.log(`AuthProvider (${eventType}) LOG 0.1: Componente desmontado, saindo de attemptToSaveTokens.`);
        return;
      }

      const shouldSave = currentSession?.provider_token &&
                         currentSession.user &&
                         tokensSavedForSessionRef.current !== currentSession.access_token;

      console.log(`AuthProvider (${eventType}) LOG 0.2: Verificando condições - provider_token: ${!!currentSession?.provider_token}, user: ${!!currentSession?.user}, tokenJáSalvo: ${tokensSavedForSessionRef.current === currentSession?.access_token}, Resultado shouldSave: ${shouldSave}`);


      if (shouldSave) {
        console.log(`AuthProvider (${eventType}) LOG 1: Condições para salvar atendidas. Tentando salvar... AccessToken: ${currentSession!.access_token?.substring(0,10)}..., RefreshToken: ${currentSession!.provider_refresh_token ? 'Presente' : 'Ausente'}`);
        try {
          await saveGoogleTokens({
            accessToken: currentSession!.provider_token!, // Usando '!' pois já verificamos
            refreshToken: currentSession!.provider_refresh_token || null,
          });
          if (isMounted) {
            tokensSavedForSessionRef.current = currentSession!.access_token!;
          }
          console.log(`AuthProvider (${eventType}) LOG 2: Chamada para saveGoogleTokens BEM SUCEDIDA.`);
        } catch (error) {
          console.error(`AuthProvider (${eventType}) LOG 2.E: ERRO ao tentar salvar tokens do Google:`, error);
        }
      } else {
        console.log(`AuthProvider (${eventType}) LOG 1.N: Condições para salvar NÃO atendidas ou já salvos.`);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`AuthProvider onAuthStateChange LOG 3: Evento: ${event}, UserID: ${currentSession?.user?.id}. isMounted: ${isMounted}`);
        if (!isMounted) {
          console.log("AuthProvider onAuthStateChange LOG 3.1: Componente desmontado, saindo do listener.");
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log(`AuthProvider onAuthStateChange LOG 4: Evento ${event}, chamando attemptToSaveTokens.`);
          await attemptToSaveTokens(currentSession, `LISTENER_${event}`);
        }

        if (event === 'SIGNED_OUT') {
          console.log("AuthProvider onAuthStateChange LOG 5: Evento SIGNED_OUT, limpando tokens e navegando.");
          if (isMounted) {
            tokensSavedForSessionRef.current = null;
          }
          navigate('/');
        }

        console.log(`AuthProvider onAuthStateChange LOG 6: Fim do callback. Estado loading atual: ${loading}`);
        // Definir loading como false aqui pode ser prematuro se checkInitialSession ainda não rodou ou se attemptToSaveTokens é longo.
        // Vamos deixar que checkInitialSession controle o setLoading(false) inicial.
      }
    );

    const checkInitialSession = async () => {
      console.log("AuthProvider checkInitialSession LOG 7: Iniciando. isMounted:", isMounted);
      if (!isMounted) { // Checagem extra
        console.log("AuthProvider checkInitialSession LOG 7.1: Desmontado antes de iniciar, saindo.");
        return;
      }
      // Não setar loading true aqui, já começa como true.

      try {
        console.log("AuthProvider checkInitialSession LOG 8: Chamando supabase.auth.getSession().");
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        console.log("AuthProvider checkInitialSession LOG 9: Retornou de supabase.auth.getSession(). isMounted:", isMounted);

        if (!isMounted) {
          console.log("AuthProvider checkInitialSession LOG 9.1: Desmontado após getSession, saindo.");
          return;
        }

        if (sessionError) {
          console.error("AuthProvider checkInitialSession LOG 9.E: Erro ao obter sessão inicial:", sessionError);
        }

        console.log("AuthProvider checkInitialSession LOG 10: Sessão obtida:", initialSession?.user?.id);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          console.log("AuthProvider checkInitialSession LOG 11: Sessão ativa inicial encontrada. Chamando attemptToSaveTokens.");
          await attemptToSaveTokens(initialSession, 'INITIAL_SESSION_CHECK');
        } else {
          console.log("AuthProvider checkInitialSession LOG 11.N: Nenhuma sessão ativa inicial encontrada.");
        }
      } catch (error) {
          console.error("AuthProvider checkInitialSession LOG 12.E: Erro catastrófico ao verificar sessão:", error);
      } finally {
          if (isMounted) {
            console.log("AuthProvider checkInitialSession LOG 13 (finally): Definindo loading para false.");
            setLoading(false);
          } else {
            console.log("AuthProvider checkInitialSession LOG 13.1 (finally): Componente desmontado, não setando loading.");
          }
      }
    };

    checkInitialSession();

    return () => {
      isMounted = false;
      console.log("AuthProvider useEffect Cleanup LOG 14: Desmontando. Desinscrevendo listener.");
      subscription.unsubscribe();
    };
  }, [navigate]); // navigate é a única dependência aqui

  const handleSignInWithGoogle = async () => {
    console.log("AuthProvider handleSignInWithGoogle LOG 15: Iniciando login.");
    try {
      await signInWithGoogleFromLib();
    } catch (error) {
      console.error("AuthProvider handleSignInWithGoogle LOG 15.E: Erro:", error);
      // Se o login falhar aqui, o loading pode precisar ser resetado se ele foi setado para true
      // Mas como loading só é setado no useEffect, talvez não seja necessário aqui.
    }
  };

  const handleSignOut = async () => {
    console.log("AuthProvider handleSignOut LOG 16: Iniciando logout.");
    try {
        await supabase.auth.signOut();
        // tokensSavedForSessionRef.current é limpo pelo evento SIGNED_OUT no listener
    } catch (error) {
        console.error("AuthProvider handleSignOut LOG 16.E: Erro:", error);
    }
  };

  console.log("AuthProvider: Antes do return do Provider. Estado loading:", loading);
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
           {/* Log para ver se o spinner está sendo renderizado */}
           {console.log("AuthProvider: Renderizando estado de 'Carregando'...")}
         </div>
      ) : (
        <>
          {/* Log para ver se os children estão sendo renderizados */}
          {console.log("AuthProvider: Renderizando 'children'...")}
          {children}
        </>
      )}
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

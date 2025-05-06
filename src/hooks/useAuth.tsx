import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithGoogle as signInWithGoogleFromLib, saveGoogleTokens } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean; // Este é o estado de carregamento que precisamos gerenciar cuidadosamente
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
      if (!isMounted) return;
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
          if (isMounted) {
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
          console.log("Usuário deslogado (listener), redirecionando para página inicial");
          if (isMounted) {
            tokensSavedForSessionRef.current = null;
          }
          navigate('/');
        }
        // Apenas define loading como false aqui se o evento for INITIAL_SESSION
        // ou se for um SIGNED_IN/OUT que efetivamente muda o estado de 'deslogado' para 'logado' ou vice-versa.
        // A lógica de carregamento principal fica no checkSession.
        if (event === 'INITIAL_SESSION' && isMounted) {
            setLoading(false);
        }
        // Se for um SIGNED_IN e antes estava deslogado (user era null), então parou de carregar
        else if (event === 'SIGNED_IN' && !user && isMounted) {
            setLoading(false);
        }
        // Se for um SIGNED_OUT, e antes estava logado, parou de carregar (já deve estar false, mas por garantia)
        else if (event === 'SIGNED_OUT' && isMounted) {
            setLoading(false);
        }
      }
    );

    // Verificar sessão existente ao montar
    const checkInitialSession = async () => {
      console.log("AuthProvider: Verificando sessão inicial (checkInitialSession)...");
      // Define loading como true no início da verificação
      if (isMounted) setLoading(true);

      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

      if (!isMounted) return; // Verifica novamente após a chamada assíncrona

      if (sessionError) {
        console.error("AuthProvider: Erro ao obter sessão inicial:", sessionError);
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

      // Define loading como false APÓS toda a lógica de checkSession ter rodado
      if (isMounted) {
        setLoading(false);
      }
    };

    checkInitialSession();

    return () => {
      isMounted = false;
      console.log("AuthProvider: Desinscrevendo listener de autenticação.");
      subscription.unsubscribe();
    };
  }, [navigate]); // Removido 'loading' da dependência, o gerenciamento de loading é interno ao effect

  const handleSignInWithGoogle = async () => {
    try {
      console.log("AuthProvider: Chamando signInWithGoogle de lib/supabase...");
      // Não definimos loading aqui, pois o onAuthStateChange e o redirectTo cuidarão da UI
      await signInWithGoogleFromLib();
    } catch (error) {
      console.error("AuthProvider: Erro ao iniciar o fluxo de login com Google:", error);
      if (isMounted) setLoading(false); // Garante que loading termine se houver erro no início do login
    }
  };

  const handleSignOut = async () => {
    try {
      // Não definimos loading aqui, o onAuthStateChange cuidará disso
      await supabase.auth.signOut();
      if (isMounted) { // Atualiza ref apenas se montado
        tokensSavedForSessionRef.current = null;
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      if (isMounted) setLoading(false); // Garante que loading termine se houver erro no logout
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
      {/* Renderiza children APENAS quando o loading inicial terminar */}
      {/* Se loading for true, pode-se mostrar um spinner/tela de carregamento global aqui em vez de nada */}
      {loading ? (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
           {/* Você pode colocar seu componente de Spinner aqui */}
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

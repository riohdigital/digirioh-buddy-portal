import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
// Adicionada a importação de saveGoogleTokens e renomeada signInWithGoogle
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
  const [loading, setLoading] = useState(true); // Inicia como true
  const navigate = useNavigate();
  // Ref para controlar se já salvamos os tokens para a sessão atual
  const tokensSavedForSessionRef = useRef<string | null>(null); // Guarda o access_token da sessão salva

  useEffect(() => {
    let isMounted = true; // Flag para verificar se o componente ainda está montado

    // --- Função para tentar salvar tokens ---
    const attemptToSaveTokens = async (currentSession: Session | null, eventType: string) => {
      // Verifica se o componente ainda está montado antes de prosseguir
      if (!isMounted) return;

      // Verifica se há tokens válidos e se ainda não foram salvos para este access_token
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
          if (isMounted) { // Só atualiza ref se montado
            tokensSavedForSessionRef.current = currentSession.access_token;
          }
          console.log(`AuthProvider (${eventType}): Chamada para salvar tokens enviada com sucesso.`);
        } catch (error) {
          console.error(`AuthProvider (${eventType}): Erro ao tentar salvar tokens do Google:`, error);
        }
      } else if (currentSession?.provider_token && currentSession.user) {
        // Este else if cobre o caso onde os tokens estão presentes, mas já foram salvos (ref é igual)
        console.log(`AuthProvider (${eventType}): Tokens já salvos para este access_token ou provider_token ausente.`);
      } else {
        console.log(`AuthProvider (${eventType}): Sem tokens do provedor na sessão atual para salvar.`);
      }
    };

    // --- Listener de Autenticação ---
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        console.log("Auth state changed:", event, "Session User ID:", currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await attemptToSaveTokens(currentSession, event);
        }

        if (event === 'SIGNED_OUT') {
          console.log("Usuário deslogado, redirecionando para página inicial");
          if (isMounted) {
            tokensSavedForSessionRef.current = null;
            // setUser(null) e setSession(null) já são feitos acima pela atualização do currentSession
          }
          navigate('/'); // A navegação deve ocorrer independentemente de isMounted
        }
        // Garante que loading seja false após o primeiro evento de autenticação ser processado
        // e o componente ainda estar montado
        if (loading && isMounted) {
          setLoading(false);
        }
      }
    );

    // --- Verificação da Sessão Inicial ---
    const checkSession = async () => {
      console.log("AuthProvider: Verificando sessão inicial...");
      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (sessionError) {
        console.error("AuthProvider: Erro ao obter sessão inicial:", sessionError);
      }

      // Atualiza o estado da sessão e usuário mesmo que o listener onAuthStateChange
      // vá disparar um evento INITIAL_SESSION logo em seguida.
      // Isso garante que o estado seja definido o mais rápido possível.
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        console.log("AuthProvider: Sessão ativa inicial encontrada para:", initialSession.user.id);
        // Tenta salvar tokens da sessão inicial
        await attemptToSaveTokens(initialSession, 'INITIAL_SESSION_CHECK');
      } else {
        console.log("AuthProvider: Nenhuma sessão ativa inicial encontrada.");
      }
      // Define loading como false APÓS checar sessão inicial E tentar salvar tokens
      if (isMounted) { // Verifica se ainda está montado antes de chamar setLoading
        setLoading(false);
      }
    };

    checkSession();

    // --- Limpeza do Listener ---
    return () => {
      isMounted = false; // Marca como desmontado
      console.log("AuthProvider: Desinscrevendo listener de autenticação.");
      subscription.unsubscribe();
    };
  // Removido 'loading' das dependências para evitar re-execuções desnecessárias do useEffect
  // A lógica de 'loading' agora é gerenciada internamente.
  }, [navigate]);

  // --- Funções Expostas pelo Contexto ---
  const handleSignInWithGoogle = async () => {
    try {
      console.log("AuthProvider: Chamando signInWithGoogle de lib/supabase...");
      await signInWithGoogleFromLib();
    } catch (error) {
      console.error("AuthProvider: Erro ao iniciar o fluxo de login com Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
        await supabase.auth.signOut();
        tokensSavedForSessionRef.current = null; // Limpa a referência ao deslogar
        // O listener onAuthStateChange com evento SIGNED_OUT cuidará de limpar user/session e navegar.
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
  };

  // --- Retorno do Provider ---
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto (permanece igual)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};


import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react'; // Adicionado useRef
import { User, Session } from '@supabase/supabase-js';
// Adicionada a importação de saveGoogleTokens
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
  // Ref para controlar se já salvamos os tokens para a sessão atual
  const tokensSavedForSessionRef = useRef<string | null>(null); // Guarda o access_token da sessão salva

  useEffect(() => {
    // --- Listener de Autenticação ---
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, "Session User ID:", currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        // setLoading(false) movido para checkSession para garantir que estado inicial seja carregado

        // --- LÓGICA PARA SALVAR TOKENS ---
        // Salvar tokens SÓ QUANDO o usuário faz SIGNED_IN ou a sessão é atualizada (TOKEN_REFRESHED)
        // E SÓ SE o provider_token (access token do Google) estiver disponível
        // E SÓ SE ainda não salvamos para este access_token específico
        if (
          currentSession?.provider_token && // Precisa do access token
          currentSession.user &&
          (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
          tokensSavedForSessionRef.current !== currentSession.access_token // Evita salvar duplicado
        ) {
          console.log(`AuthProvider (${event}): Novos tokens do provedor detectados. Tentando salvar...`);
          console.log(` - Access Token Session: ${currentSession.provider_token ? 'Presente' : 'Ausente'}`);
          console.log(` - Refresh Token Session: ${currentSession.provider_refresh_token ? 'Presente' : 'Ausente'}`); // Log para verificar se o refresh token vem na sessão
          try {
            await saveGoogleTokens({ // Chama a função importada de lib/supabase
              accessToken: currentSession.provider_token,
              // Passa o refresh token da sessão, se existir.
              refreshToken: currentSession.provider_refresh_token || null,
            });
            // Marca este access_token como salvo para não tentar salvar de novo na mesma sessão
            tokensSavedForSessionRef.current = currentSession.access_token;
            console.log(`AuthProvider (${event}): Chamada para salvar tokens enviada com sucesso.`);
          } catch (error) {
            console.error(`AuthProvider (${event}): Erro ao tentar salvar tokens do Google:`, error);
            // Adicionar feedback para o usuário aqui (ex: toast) se necessário
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log(`AuthProvider (${event}): Evento detectado, mas sem novos tokens (provider_token ausente ou já salvo anteriormente para este access_token).`);
        }
        // --- FIM DA LÓGICA PARA SALVAR TOKENS ---

        // --- Lógica de Navegação (Apenas para SIGNED_OUT) ---
        if (event === 'SIGNED_OUT') {
          console.log("Usuário deslogado, redirecionando para página inicial");
          tokensSavedForSessionRef.current = null; // Limpa a referência ao deslogar
          setUser(null); // Garante que user seja null no estado
          setSession(null); // Garante que session seja null no estado
          navigate('/');
        }
        // --- FIM DA Lógica de Navegação ---
      }
    );

    // --- Verificação da Sessão Inicial ---
    const checkSession = async () => {
      console.log("AuthProvider: Verificando sessão inicial...");
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if(sessionError){
        console.error("AuthProvider: Erro ao obter sessão inicial:", sessionError);
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        console.log("AuthProvider: Sessão ativa inicial encontrada para:", currentSession.user.id);
        // Verifica se a sessão inicial já tem tokens e se ainda não foram salvos
        // Usa a mesma lógica do onAuthStateChange para consistência
        if (currentSession.provider_token && tokensSavedForSessionRef.current !== currentSession.access_token) {
           console.log(`AuthProvider (INITIAL_SESSION): Tokens detectados na sessão inicial. Tentando salvar...`);
           console.log(` - Access Token Session: ${currentSession.provider_token ? 'Presente' : 'Ausente'}`);
           console.log(` - Refresh Token Session: ${currentSession.provider_refresh_token ? 'Presente' : 'Ausente'}`);
           try {
              await saveGoogleTokens({
                 accessToken: currentSession.provider_token,
                 refreshToken: currentSession.provider_refresh_token || null,
              });
              tokensSavedForSessionRef.current = currentSession.access_token; // Marca como salvo
              console.log(`AuthProvider (INITIAL_SESSION): Chamada para salvar tokens enviada com sucesso.`);
           } catch (error) {
              console.error(`AuthProvider (INITIAL_SESSION): Erro ao tentar salvar tokens do Google:`, error);
           }
        } else {
            console.log("AuthProvider (INITIAL_SESSION): Sem novos tokens para salvar na sessão inicial ou já salvos.");
        }
      } else {
        console.log("AuthProvider: Nenhuma sessão ativa inicial encontrada.");
      }
      // Define loading como false somente APÓS checar sessão inicial E tentar salvar tokens iniciais
      setLoading(false);
    };

    checkSession();

    // --- Limpeza do Listener ---
    return () => {
      console.log("AuthProvider: Desinscrevendo listener de autenticação.");
      subscription.unsubscribe();
    };
  // Dependência do navigate apenas para o SIGNED_OUT
  }, [navigate]);

  // --- Funções Expostas pelo Contexto ---
  // Função para iniciar o login (chama a de lib/supabase)
  const handleSignInWithGoogle = async () => {
    try {
      console.log("AuthProvider: Chamando signInWithGoogle de lib/supabase...");
      await signInWithGoogleFromLib(); // Chama a função correta importada
    } catch (error) {
      console.error("AuthProvider: Erro ao iniciar o fluxo de login com Google:", error);
    }
  };

  // Função de logout
  const handleSignOut = async () => {
    try {
        await supabase.auth.signOut();
        tokensSavedForSessionRef.current = null; // Limpa a referência ao deslogar
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
}; // Fim do AuthProvider

// Hook para consumir o contexto - THIS IS THE EXPORT THAT WAS MISSING
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

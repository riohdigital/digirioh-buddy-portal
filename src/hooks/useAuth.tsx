
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, saveGoogleTokens } from '@/lib/supabase';

// Context type definition
type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// Define Provider props
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Refs to track state and prevent duplicate operations
  const initialCheckDoneRef = useRef(false);
  const tokensSavedForSessionRef = useRef<string | null>(null);
  const effectRunRef = useRef(0);
  const isMountedRef = useRef(true);
  
  const LOG_PREFIX = "[AuthProvider]";

  // Function to attempt saving tokens with improved error handling
  const attemptToSaveTokens = async (currentSession: Session | null, eventType: string) => {
    // Only attempt to save if we have a valid session with tokens
    if (!currentSession || !currentSession.provider_token) {
      console.log(`${LOG_PREFIX} (${eventType}) No session or provider_token to save`);
      return;
    }

    // Check if we've already saved these tokens
    const shouldSave = currentSession.access_token !== tokensSavedForSessionRef.current;
    
    if (shouldSave) {
      console.log(`${LOG_PREFIX} (${eventType}) LOG 1: Condições para salvar atendidas. Tentando salvar... AccessToken: ${currentSession.access_token?.substring(0,10)}..., RefreshToken: ${currentSession.provider_refresh_token ? 'Presente' : 'Ausente'}`);
      try {
        console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] Chamando saveGoogleTokens.`);
        await saveGoogleTokens({
          accessToken: currentSession.provider_token,
          refreshToken: currentSession.provider_refresh_token || null,
        });
        if (isMountedRef.current) {
          tokensSavedForSessionRef.current = currentSession.access_token;
        }
        console.log(`${LOG_PREFIX} (${eventType}) LOG 2: Salvamento de tokens BEM SUCEDIDO.`);
      } catch (error) {
        console.error(`${LOG_PREFIX} (${eventType}) LOG 2.E: ERRO ao tentar salvar tokens do Google:`, error);
        // Continuamos mesmo com erro para não bloquear o fluxo de autenticação
      } finally {
        // Garante que mesmo em caso de erro, o aplicativo continua funcionando
        console.log(`${LOG_PREFIX} (${eventType}) LOG 2.F: Finalizando chamada saveGoogleTokens, com ou sem sucesso.`);
      }
    } else {
      console.log(`${LOG_PREFIX} (${eventType}) Tokens já salvos para essa sessão ou nada a salvar.`);
    }
    console.log(`${LOG_PREFIX} (${eventType}) LOG 2.X: Fim de attemptToSaveTokens.`);
  };

  // Check for initial session
  const checkInitialSession = async () => {
    console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] START. isMounted: ${isMountedRef.current}`);
    try {
      console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] AWAITING supabase.auth.getSession().`);
      const { data } = await supabase.auth.getSession();
      
      if (isMountedRef.current) {
        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] RETURNED from supabase.auth.getSession(). isMounted: ${isMountedRef.current}`);
        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] PRE-SET_STATE: initial session user: ${JSON.stringify({ 
          _type: typeof data.session?.user, 
          value: typeof data.session?.user === 'undefined' ? 'undefined' : data.session?.user?.email 
        })}`);
        
        setUser(data.session?.user ?? null);
        setSession(data.session);
        
        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] POST-SET_STATE.`);
        
        // If we have a session, attempt to save tokens
        if (data.session) {
          console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] Session found, attempting to save tokens.`);
          await attemptToSaveTokens(data.session, "INITIAL");
        } else {
          console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] No initial session found.`);
        }
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] Error:`, error);
    } finally {
      // Always make sure we finish loading, even if there's an error
      if (isMountedRef.current) {
        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] FINALLY: Setting initialCheckDoneRef=true, setLoading=false. Current loading state: ${loading}`);
        initialCheckDoneRef.current = true;
        setLoading(false);
      }
      console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] END.`);
    }
  };

  useEffect(() => {
    console.log(`${LOG_PREFIX} useEffect [RUN ${effectRunRef.current}] START. isMounted: ${isMountedRef.current}`);
    effectRunRef.current += 1;
    isMountedRef.current = true;

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`${LOG_PREFIX} onAuthStateChange LOG 3: Evento: ${event}, UserID: ${currentSession?.user?.id}. isMounted: ${isMountedRef.current}`);
        
        if (isMountedRef.current) {
          console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] PRE-SET_STATE: current session user: ${JSON.stringify({ 
            _type: typeof currentSession?.user, 
            value: typeof currentSession?.user === 'undefined' ? 'undefined' : currentSession?.user?.email 
          })}`);
          
          setUser(currentSession?.user ?? null);
          setSession(currentSession);
          
          console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] POST-SET_STATE.`);
          
          // For specific events, try to save Google tokens
          if (currentSession && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
            // Wrap in setTimeout to avoid potential issues in auth state change callback
            setTimeout(() => {
              attemptToSaveTokens(currentSession, event);
            }, 0);
          }
          
          // If initial check is done and we're on a sign out event, ensure loading is false
          if (initialCheckDoneRef.current && event === "SIGNED_OUT") {
            console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] SIGNED_OUT, ensuring loading=false`);
            setLoading(false);
          }
        }
        
        console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] END of callback for event ${event}.`);
      }
    );

    // Run initial session check
    checkInitialSession();

    // Cleanup on unmount
    return () => {
      console.log(`${LOG_PREFIX} useEffect CLEANUP: Unsubscribing and setting isMounted=false`);
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  // Render loading state or children based on loading
  console.log(`${LOG_PREFIX} RENDER_START`);
  console.log(`${LOG_PREFIX} RENDER_END. Loading state: ${loading}`);
  if (loading) {
    console.log(`${LOG_PREFIX} UI: Rendering 'Carregando...'`);
    return <div className="flex h-screen w-screen items-center justify-center">Carregando...</div>;
  }
  console.log(`${LOG_PREFIX} UI: Rendering 'children'`);

  // Auth functions
  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: 'https://mail.google.com/ https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
    } catch (error) {
      console.error("Erro ao iniciar login com Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  // Provide auth context
  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

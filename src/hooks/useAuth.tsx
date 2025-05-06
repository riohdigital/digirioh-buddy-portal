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

const LOG_PREFIX = "[AuthProvider]";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log(`${LOG_PREFIX} RENDER_START`);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const tokensSavedForSessionRef = useRef<string | null>(null);
  const initialCheckDoneRef = useRef(false);
  const effectRunRef = useRef(0); // Para contar execuções do useEffect

  useEffect(() => {
    effectRunRef.current += 1;
    let isMounted = true;
    console.log(`${LOG_PREFIX} useEffect [RUN ${effectRunRef.current}] START. isMounted: ${isMounted}`);

    const attemptToSaveTokens = async (currentSession: Session | null, eventType: string) => {
      console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] CALLED. isMounted: ${isMounted}`);
      if (!isMounted) {
        console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] ABORT: Unmounted.`);
        return;
      }

      const shouldSave = currentSession?.provider_token &&
                         currentSession.user &&
                         tokensSavedForSessionRef.current !== currentSession.access_token;

      console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] Conditions: provider_token: ${!!currentSession?.provider_token}, user: ${!!currentSession?.user}, tokenAlreadySavedForThisAccessToken: ${tokensSavedForSessionRef.current === currentSession?.access_token}. ShouldSave: ${shouldSave}`);

      if (shouldSave) {
        console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] PRE-SAVE: AccessToken: ${currentSession!.access_token?.substring(0,10)}..., RefreshToken: ${currentSession!.provider_refresh_token ? 'Presente' : 'Ausente'}`);
        try {
          console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] AWAITING saveGoogleTokens...`);
          await saveGoogleTokens({
            accessToken: currentSession!.provider_token!,
            refreshToken: currentSession!.provider_refresh_token || null,
          });
          if (isMounted) {
            tokensSavedForSessionRef.current = currentSession!.access_token!;
          }
          console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] SUCCESS: saveGoogleTokens completed.`);
        } catch (error) {
          console.error(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] ERROR: Failed to save tokens:`, error);
        }
      } else {
        console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] SKIPPED: Conditions not met or token already saved.`);
      }
      console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] END.`);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] EVENT: ${event}, UserID: ${currentSession?.user?.id}. isMounted: ${isMounted}`);
        if (!isMounted) {
          console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] ABORT: Unmounted.`);
          return;
        }

        console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] PRE-SET_STATE: current session user:`, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] POST-SET_STATE.`);

        if (initialCheckDoneRef.current && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] Event ${event} (post-initial check), calling attemptToSaveTokens.`);
          await attemptToSaveTokens(currentSession, `LISTENER_${event}`);
        }

        if (event === 'SIGNED_OUT') {
          console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] Event SIGNED_OUT. Cleaning up and navigating.`);
          if (isMounted) tokensSavedForSessionRef.current = null;
          navigate('/');
        }

        if (initialCheckDoneRef.current && loading && isMounted) {
            console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] Event ${event} (post-initial check), current loading: ${loading}. Setting loading to false.`);
            setLoading(false);
        }
        console.log(`${LOG_PREFIX} onAuthStateChange [RUN ${effectRunRef.current}] END of callback for event ${event}.`);
      }
    );

    const checkInitialSession = async () => {
      console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] START. isMounted: ${isMounted}`);
      if (!isMounted) {
        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] ABORT: Unmounted at start.`);
        // Se desmontado no início, talvez não precise setar loading false, mas é mais seguro garantir
        if (isMounted && loading) setLoading(false);
        return;
      }

      try {
        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] AWAITING supabase.auth.getSession().`);
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] RETURNED from supabase.auth.getSession(). isMounted: ${isMounted}`);

        if (!isMounted) {
          console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] ABORT: Unmounted after getSession.`);
          return;
        }

        if (sessionError) {
          console.error(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] ERROR from getSession:`, sessionError);
        }

        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] PRE-SET_STATE: initial session user:`, initialSession?.user?.email);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] POST-SET_STATE.`);

        if (initialSession?.user) {
          console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] Session found. Calling attemptToSaveTokens.`);
          await attemptToSaveTokens(initialSession, 'INITIAL_SESSION_CHECK');
        } else {
          console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] No initial session found.`);
        }
      } catch (error) {
          console.error(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] CATCH_ALL_ERROR:`, error);
      } finally {
          if (isMounted) {
            console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] FINALLY: Setting initialCheckDoneRef=true, setLoading=false. Current loading state: ${loading}`);
            initialCheckDoneRef.current = true;
            setLoading(false);
          } else {
            console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] FINALLY: Unmounted. Not setting state.`);
          }
      }
      console.log(`${LOG_PREFIX} checkInitialSession [RUN ${effectRunRef.current}] END.`);
    };

    checkInitialSession();

    return () => {
      isMounted = false;
      console.log(`${LOG_PREFIX} useEffect Cleanup [RUN ${effectRunRef.current}] START. Unsubscribing.`);
      subscription.unsubscribe();
      console.log(`${LOG_PREFIX} useEffect Cleanup [RUN ${effectRunRef.current}] END.`);
    };
  }, [navigate]); // Mantenha apenas 'navigate' aqui

  const handleSignInWithGoogle = async () => {
    console.log(`${LOG_PREFIX} handleSignInWithGoogle CALLED.`);
    try {
      // Não setamos loading=true aqui, pois o fluxo de redirect e onAuthStateChange cuidará disso.
      await signInWithGoogleFromLib();
      console.log(`${LOG_PREFIX} handleSignInWithGoogle: signInWithGoogleFromLib chamado.`);
    } catch (error) {
      console.error(`${LOG_PREFIX} handleSignInWithGoogle ERROR:`, error);
      // Se o próprio início do login falhar, talvez seja necessário setLoading(false) aqui.
      // Mas é raro falhar antes do redirect.
    }
  };

  const handleSignOut = async () => {
    console.log(`${LOG_PREFIX} handleSignOut CALLED.`);
    try {
      await supabase.auth.signOut();
      // A lógica de tokensSavedForSessionRef.current = null; está no onAuthStateChange para SIGNED_OUT.
      console.log(`${LOG_PREFIX} handleSignOut: signOut chamado.`);
    } catch (error) {
      console.error(`${LOG_PREFIX} handleSignOut ERROR:`, error);
    }
  };

  console.log(`${LOG_PREFIX} RENDER_END. Loading state: ${loading}`);
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
           {console.log(`${LOG_PREFIX} UI: Rendering 'Carregando...'`)}
         </div>
      ) : (
        <>
          {console.log(`${LOG_PREFIX} UI: Rendering 'children'`)}
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

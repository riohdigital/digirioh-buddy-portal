import { createClient, User, Session } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // Certifique-se que este tipo está correto

// ----- Configuração do Cliente Supabase -----
const supabaseUrl = 'https://uoeshejtkzngnqxtqtbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZXNoZWp0a3puZ25xeHRxdGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTg3NDEsImV4cCI6MjA1OTEzNDc0MX0.URL7EMIL6dqMEJI33ZILQd3pO3AXKAB3zajBQQpx1kc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// ----- Funções de Autenticação -----
export const signInWithGoogle = async () => {
  console.log("Iniciando login com Google (Fluxo Padrão Supabase)...");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.profile',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    },
  });

  if (error) {
    console.error("Erro no login com Google:", error.message);
    throw error;
  }

  console.log("Login com Google iniciado, redirecionamento para Google...", data?.url);
};

export const signOut = async () => {
  console.log("Deslogando usuário...");
  return supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  console.log("Obtendo usuário atual...");
  return supabase.auth.getUser();
};

export const getCurrentSession = async () => {
  console.log("Obtendo sessão atual...");
  return supabase.auth.getSession();
};

// ----- Função para Salvar Tokens do Google (COM LOGS DETALHADOS E TIMEOUT) -----
export const saveGoogleTokens = async (tokens: { accessToken: string; refreshToken: string | null }) => {
  const LOG_PREFIX_LIB = "[lib/supabase saveGoogleTokens]";
  console.log(`${LOG_PREFIX_LIB} Iniciada com tokens: AccessToken ${tokens.accessToken ? 'Presente' : 'Ausente'}, RefreshToken ${tokens.refreshToken ? 'Presente' : 'Ausente'}`);

  // Verificação inicial dos tokens
  if (!tokens.accessToken) {
    console.warn(`${LOG_PREFIX_LIB} Access token ausente. Não chamando a Edge Function.`);
    throw new Error("Access token ausente, não foi possível salvar tokens.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error(`${LOG_PREFIX_LIB} Usuário não autenticado.`);
    throw new Error("Usuário não autenticado para salvar tokens.");
  }

  console.log(`${LOG_PREFIX_LIB} Chamando Edge Function 'save-google-tokens' para userId: ${user.id}`);

  // Implementar um timeout para a chamada da Edge Function
  try {
    // Criamos uma promessa que rejeita após um timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout ao chamar Edge Function")), 10000); // 10 segundos de timeout
    });
    
    // Criamos a promessa da chamada normal
    const callPromise = supabase.functions.invoke("save-google-tokens", {
      body: {
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
    
    // Usamos Promise.race para pegar o que resolver primeiro
    console.log(`${LOG_PREFIX_LIB} PRESTES A CHAMAR supabase.functions.invoke com timeout...`);
    const result = await Promise.race([callPromise, timeoutPromise]);
    console.log(`${LOG_PREFIX_LIB} RETORNOU de supabase.functions.invoke.`);
    
    // Agora analisamos o resultado (que será do tipo Response da função invoke)
    const { data, error } = result as any;
    
    if (error) {
      console.error(`${LOG_PREFIX_LIB} ERRO retornado por invoke:`, error);
      const errorMessage = error.context?.body?.error || error.message || "Erro desconhecido da Edge Function";
      throw new Error(`Falha ao invocar 'save-google-tokens': ${errorMessage}`);
    }

    console.log(`${LOG_PREFIX_LIB} Resposta da Edge Function 'save-google-tokens' (dados):`, data);
    if (data && data.success) {
      return data;
    } else {
      console.warn(`${LOG_PREFIX_LIB} Resposta da Edge Function não indicou sucesso ou formato inesperado:`, data);
      throw new Error(`Resposta inesperada da Edge Function 'save-google-tokens': ${JSON.stringify(data)}`);
    }
  } catch (invocationError) {
    console.error(`${LOG_PREFIX_LIB} ERRO NO CATCH GERAL ao invocar Edge Function:`, invocationError);
    // Não propagamos o erro para permitir que o fluxo de autenticação continue
    // Apenas registramos o erro e retornamos um objeto de sucesso falso
    return { success: false, error: invocationError.message };
  }
};

// ----- Funções de Perfil de Usuário -----
export const getUserProfile = async () => {
  console.log("Buscando perfil do usuário...");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("Nenhum usuário logado para buscar perfil.");
    return null;
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Erro ao buscar perfil:", error);
        throw error;
    }
    console.log("Perfil encontrado:", profile);
    return profile;
  } catch(err) {
      console.error("Exceção ao buscar perfil:", err);
      return null;
  }
};

// ----- Funções de WhatsApp -----
export const unlinkWhatsappCode = async () => {
  // Esta função parece ser a mesma que unlinkWhatsapp, pode ser redundante
  console.warn("Chamando função 'unlinkWhatsappCode' (atualiza DB diretamente)...");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("Nenhum usuário logado para desconectar WhatsApp (DB).");
    return null;
  }

  return supabase
    .from('profiles')
    .update({ whatsapp_jid: null })
    .eq('id', user.id);
};

export const generateWhatsappCode = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
     console.error("generateWhatsappCode: Usuário não autenticado.");
     throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  console.log(`Chamando Edge Function 'generate-whatsapp-code' para userId: ${user.id}`);

  const { data, error } = await supabase.functions.invoke("generate-whatsapp-code", {
    body: { userId: user.id },
  });

  if (error) {
    console.error("Erro ao invocar Edge Function 'generate-whatsapp-code':", error);
    throw error;
  }

  console.log("Resposta recebida da Edge Function 'generate-whatsapp-code':", data);

  if (!data || typeof data.code !== 'string') {
      console.warn("Resposta da função 'generate-whatsapp-code' não contém a propriedade 'code' esperada:", data);
      throw new Error("Resposta inválida do servidor ao gerar código.");
  }

  return data as { code: string };
};

export const unlinkWhatsapp = async () => {
  const { data: { user } } = await supabase.auth.getUser();
   if (!user) {
     console.error("unlinkWhatsapp: Usuário não autenticado."); // Nome da função no log corrigido
     throw new Error("Usuário não autenticado. Faça login novamente.");
   }

  console.log(`Chamando Edge Function 'unlink-whatsapp' para userId: ${user.id}`);

  const { data, error } = await supabase.functions.invoke("unlink-whatsapp", {
    body: { userId: user.id },
  });

   if (error) {
    console.error("Erro ao invocar Edge Function 'unlink-whatsapp':", error);
    throw error;
   }

  console.log("Resposta recebida da Edge Function 'unlink-whatsapp':", data);
  return data;
};

// REMOVIDA: A função exchangeGoogleAuthCode foi removida pois não é mais utilizada neste fluxo.
// Se ela existia aqui, certifique-se de que foi completamente deletada.

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // Certifique-se que este tipo está correto

// ----- Configuração do Cliente Supabase -----
const supabaseUrl = 'https://uoeshejtkzngnqxtqtbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZXNoZWp0a3puZ25xeHRxdGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTg3NDEsImV4cCI6MjA1OTEzNDc0MX0.URL7EMIL6dqMEJI33ZILQd3pO3AXKAB3zajBQQpx1kc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Mantido como true
  },
});


// ----- Funções de Autenticação (ATUALIZADAS) -----

/**
 * Inicia o fluxo de login com o Google, solicitando acesso offline
 * para obter o refresh token e redirecionando para o dashboard.
 * (MODIFICADA NESTA ATUALIZAÇÃO)
 */
export const signInWithGoogle = async () => {
  console.log("Iniciando login com Google (com solicitação de refresh token)...");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Redireciona para a página principal após login bem-sucedido
      redirectTo: `${window.location.origin}/dashboard`,
      // Solicita o refresh token e a tela de consentimento
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      // Defina os escopos necessários
      scopes: 'https://mail.google.com/ https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    },
  });

  if (error) {
    console.error("Erro no login com Google:", error.message);
    throw error;
  }

  console.log("Redirecionamento para o Google iniciado...");
  return data;
};

/**
 * Desloga o usuário atual.
 * (MANTIDA)
 */
export const signOut = async () => {
  console.log("Deslogando usuário...");
  return supabase.auth.signOut();
};

/**
 * Obtém o usuário atualmente logado.
 * (MANTIDA)
 */
export const getCurrentUser = async () => {
  console.log("Obtendo usuário atual...");
  return supabase.auth.getUser();
};

/**
 * Obtém a sessão atual do usuário.
 * (MANTIDA)
 */
export const getCurrentSession = async () => {
  console.log("Obtendo sessão atual...");
  return supabase.auth.getSession();
};

// ----- Funções de Perfil de Usuário (MANTIDAS) -----
export const getUserProfile = async () => {
  console.log("Buscando perfil do usuário...");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("Nenhum usuário logado para buscar perfil.");
    return null;
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles') // Certifique-se que o nome da tabela está correto
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignora 'Row not found'
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


// ----- Funções do WhatsApp (MANTIDAS) -----

/**
 * Chama a Edge Function 'generate-whatsapp-code' para obter um código de vinculação.
 * (MANTIDA)
 */
export const generateWhatsappCode = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
     console.error("generateWhatsappCode: Usuário não autenticado.");
     throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  console.log(`Chamando Edge Function 'generate-whatsapp-code' para userId: ${user.id}`);

  const { data, error } = await supabase.functions.invoke("generate-whatsapp-code", {
    body: { userId: user.id }, // Supabase JS v2+ não precisa de JSON.stringify aqui
  });

  if (error) {
    console.error("Erro ao invocar Edge Function 'generate-whatsapp-code':", error);
    throw error;
  }

  console.log("Resposta recebida da Edge Function 'generate-whatsapp-code':", data);

  // Adicionada verificação mais robusta da resposta
  if (!data || typeof data.code !== 'string') {
      console.warn("Resposta da função 'generate-whatsapp-code' não contém a propriedade 'code' esperada:", data);
      throw new Error("Resposta inválida do servidor ao gerar código.");
  }

  return data as { code: string };
};

/**
 * Chama a Edge Function 'unlink-whatsapp' para desconectar o WhatsApp.
 * (MANTIDA)
 */
export const unlinkWhatsapp = async () => {
  const { data: { user } } = await supabase.auth.getUser();
   if (!user) {
     console.error("unlinkWhatsappCode: Usuário não autenticado.");
     throw new Error("Usuário não autenticado. Faça login novamente.");
   }

  console.log(`Chamando Edge Function 'unlink-whatsapp' para userId: ${user.id}`);

  const { data, error } = await supabase.functions.invoke("unlink-whatsapp", {
    body: { userId: user.id }, // Supabase JS v2+ não precisa de JSON.stringify aqui
  });

   if (error) {
    console.error("Erro ao invocar Edge Function 'unlink-whatsapp':", error);
    throw error;
   }

  console.log("Resposta recebida da Edge Function 'unlink-whatsapp':", data);
  return data;
};

// ----- FUNÇÃO PARA CHAMAR A EDGE FUNCTION DE SALVAR TOKENS (ADICIONADA) -----

/**
 * Invoca a Edge Function 'save-google-tokens' para armazenar
 * o access token e o refresh token no banco de dados.
 * (ADICIONADA NESTA ATUALIZAÇÃO)
 */
export const saveGoogleTokens = async (userId: string, accessToken: string | null, refreshToken: string | null) => {
  // Verifica se os tokens essenciais estão presentes
  if (!userId || !accessToken || !refreshToken) {
      console.error('saveGoogleTokens: Faltam dados essenciais (userId, accessToken, refreshToken).', { userId, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
      return; // Retorna para não quebrar o fluxo
  }

  console.log(`Chamando Edge Function save-google-tokens para userId: ${userId}...`);
  try {
    // Importante: Se usar Supabase JS v1.x, pode precisar de JSON.stringify. V2+ lida com isso.
    const { data, error } = await supabase.functions.invoke('save-google-tokens', {
      body: { userId, accessToken, refreshToken },
    });

    if (error) {
      console.error('Erro ao chamar Edge Function save-google-tokens:', error);
      let errorMessage = error.message;
      // Tenta obter detalhes do erro do contexto da resposta da função
      if (error.context && error.context.status) {
          errorMessage = `HTTP ${error.context.status}: ${error.message}`;
          // Tentar ler o corpo da resposta se for JSON
          try {
              const errorBody = await error.context.json();
              errorMessage = errorBody.error || errorBody.details || errorMessage;
          } catch (_) { /* Ignora erro ao parsear json */ }
      }
      throw new Error(`Erro da Edge Function: ${errorMessage}`);
    }

    console.log('Edge Function save-google-tokens executada com sucesso:', data);
    return data;
  } catch (err: any) { // Captura qualquer erro
    console.error('Erro inesperado ao salvar tokens:', err);
    throw err; // Re-lança o erro para ser tratado no useAuth
  }
};

// ----- FUNÇÃO REMOVIDA -----
// A função exchangeGoogleAuthCode foi removida pois não é mais necessária neste fluxo.


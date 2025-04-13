import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // Certifique-se que este tipo está correto

// ----- Configuração do Cliente Supabase (MANTENHA COMO ESTÁ) -----
const supabaseUrl = 'https://uoeshejtkzngnqxtqtbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZXNoZWp0a3puZ25xeHRxdGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTg3NDEsImV4cCI6MjA1OTEzNDc0MX0.URL7EMIL6dqMEJI33ZILQd3pO3AXKAB3zajBQQpx1kc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Mantém true para ler tokens do hash
  },
});


// ----- Funções de Autenticação -----

// ** 1. FUNÇÃO signInWithGoogle MODIFICADA **
export const signInWithGoogle = async () => {
  console.log("Iniciando login com Google (Fluxo Padrão Supabase)...");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Redireciona para o dashboard onde onAuthStateChange irá capturar a sessão
      redirectTo: `${window.location.origin}/dashboard`, // <<< CORRIGIDO
      // Mantém os escopos necessários
      scopes: 'https://mail.google.com/ https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      // Mantém queryParams para solicitar refresh token
      queryParams: { // <<< MANTIDO
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
  // Não retorna 'data' aqui, o redirecionamento acontece no navegador
};

// Função signOut (sem alterações)
export const signOut = async () => {
  console.log("Deslogando usuário...");
  return supabase.auth.signOut();
};

// Função getCurrentUser (sem alterações)
export const getCurrentUser = async () => {
  console.log("Obtendo usuário atual...");
  return supabase.auth.getUser();
};

// Função getCurrentSession (sem alterações)
export const getCurrentSession = async () => {
  console.log("Obtendo sessão atual...");
  return supabase.auth.getSession();
};

// ** 2. FUNÇÃO saveGoogleTokens ADICIONADA/CONFIRMADA **
export const saveGoogleTokens = async (tokens: { accessToken: string; refreshToken: string | null }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("saveGoogleTokens: Usuário não autenticado.");
    throw new Error("Usuário não autenticado para salvar tokens.");
  }

  // Verifica se há tokens válidos para enviar
  if (!tokens.accessToken) {
    console.warn("saveGoogleTokens: Access token ausente, não chamando a Edge Function.");
    return { success: false, message: "Access token ausente."};
  }

  console.log(`Chamando Edge Function 'save-google-tokens' para userId: ${user.id}`);
  console.log(` - Access Token: ${tokens.accessToken ? 'Presente' : 'Ausente'}`);
  console.log(` - Refresh Token: ${tokens.refreshToken ? 'Presente' : 'Ausente'}`);

  try {
    // Chama a Edge Function que deve existir no Supabase
    const { data, error } = await supabase.functions.invoke("save-google-tokens", {
      body: {
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken, // Envia null se não existir
      },
    });

    if (error) {
      console.error("Erro ao invocar 'save-google-tokens':", error);
      throw error; // Repassa o erro
    }
    console.log("Resposta da Edge Function 'save-google-tokens':", data);
    return data; // Retorna a resposta da função (ex: { success: true })
  } catch (invocationError) {
    console.error("saveGoogleTokens: Exceção ao invocar Edge Function:", invocationError);
    throw invocationError; // Re-throw
  }
};

// ----- Funções de Perfil de Usuário (MANTENHA COMO ESTÃO) -----
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
      .single(); // .single() retorna erro se não encontrar ou encontrar mais de um

    if (error && error.code !== 'PGRST116') { // PGRST116 = 'Row not found' (não é um erro crítico aqui)
        console.error("Erro ao buscar perfil:", error);
        throw error; // Lança outros erros
    }
    console.log("Perfil encontrado:", profile);
    return profile;
  } catch(err) {
      console.error("Exceção ao buscar perfil:", err);
      return null; // Retorna null em caso de erro ou não encontrado
  }
};


// ----- Função Original de Desconectar WhatsApp (Via DB - Mantenha por precaução) -----
export const unlinkWhatsappCode = async () => {
  console.warn("Chamando função 'unlinkWhatsapp' (atualiza DB diretamente)...");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("Nenhum usuário logado para desconectar WhatsApp (DB).");
    return null;
  }

  return supabase
    .from('profiles') // Certifique-se que o nome da tabela está correto
    .update({ whatsapp_jid: null }) // Confirme o nome da coluna
    .eq('id', user.id);
};


// ----- FUNÇÕES CORRIGIDAS PARA CHAMAR AS EDGE FUNCTIONS -----

/**
 * Chama a Edge Function 'generate-whatsapp-code' para obter um código de vinculação.
 * Espera que a Edge Function retorne um JSON como: { code: "123456" } em caso de sucesso.
 */
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

/**
 * Chama a Edge Function 'unlink-whatsapp' para desconectar o WhatsApp.
 */
export const unlinkWhatsapp = async () => {
  const { data: { user } } = await supabase.auth.getUser();
   if (!user) {
     console.error("unlinkWhatsappCode: Usuário não autenticado.");
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

/**
 * Chama a Edge Function 'auth-google-exchange' para trocar o código de autorização
 * por tokens de acesso e refresh, armazenando o refresh token no banco de dados.
 */
export const exchangeGoogleAuthCode = async (code: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Objeto user:", user); // Adicione esta linha
  if (!user) {
    console.error("exchangeGoogleAuthCode: Usuário não autenticado.");
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  console.log("exchangeGoogleAuthCode: User object:", user);
  console.log(`Chamando Edge Function 'auth-google-exchange' para código: ${code.substring(0, 10)}...`);

  const redirectUrl = `${window.location.origin}/auth-callback`;
  
  const { data, error } = await supabase.functions.invoke("auth-google-exchange", {
    body: { 
      code,
      redirectUrl
    },
  });

  if (error) {
    console.error("Erro ao invocar Edge Function 'auth-google-exchange':", error);
    throw error;
  }

  console.log("Resposta recebida da Edge Function 'auth-google-exchange':", data);
  return data;
};

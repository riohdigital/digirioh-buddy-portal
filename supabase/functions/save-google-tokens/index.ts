
// supabase/functions/save-google-tokens/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts' // Verifique se esta versão do std está ok ou use uma mais recente se preferir
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2' // Usando V2

// --- IMPORTANTE: PLACEHOLDER PARA CRIPTOGRAFIA ---
// Substitua esta função placeholder por uma implementação de criptografia real
// usando a Web Crypto API (SubtleCrypto) e uma chave segura dos Secrets.
async function encryptToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  // NÃO USE EM PRODUÇÃO! Base64 não é criptografia segura.
  console.warn("CRIPTOGRAFIA DE EXEMPLO (Base64) SENDO USADA - INSEGURA PARA PRODUÇÃO!");
  try {
      return btoa(token); // Placeholder: Codifica em Base64
  } catch (e) {
      console.error("Erro ao codificar token (Base64 - placeholder):", e);
      return null; // Retorna null se houver erro na codificação/criptografia
  }
}
// Você também precisará de uma função decryptToken na Edge Function de refresh
// ---------------------------------------------------

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Para desenvolvimento. Restrinja ao seu domínio em produção.
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST', // Apenas POST é necessário para esta função
}

console.log("Função 'save-google-tokens' inicializada.");

serve(async (req) => {
  // Trata requisição CORS preflight
  if (req.method === 'OPTIONS') {
    console.log("Recebida requisição OPTIONS (preflight)");
    return new Response(null, { headers: corsHeaders })
  }

  // Verifica se o método é POST
  if (req.method !== 'POST') {
    console.log(`Método não permitido: ${req.method}`);
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
        status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  console.log("Recebida requisição POST...");

  try {
    // 1. Extrai dados do body
    const { userId, accessToken, refreshToken } = await req.json()
    console.log(`Dados recebidos - UserID: ${userId}, AccessToken: ${accessToken ? 'Sim' : 'Não'}, RefreshToken: ${refreshToken ? 'Sim' : 'Não'}`);


    // 2. Validação básica de entrada
    if (!userId || !accessToken) { // RefreshToken pode ser null
      console.error('Inputs inválidos: userId ou accessToken faltando.');
      return new Response(
        JSON.stringify({ error: 'userId e accessToken são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Inicializa cliente Supabase Admin (com Service Key)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas.");
        throw new Error("Configuração do servidor Supabase incompleta.");
    }
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    console.log("Cliente Supabase Admin inicializado.");


    // 4. Criptografa o Refresh Token (se existir) - **IMPLEMENTAR CRIPTOGRAFIA REAL**
    const encryptedRefreshToken = await encryptToken(refreshToken); // Usa a função placeholder ou sua implementação real
    console.log(`Refresh Token para salvar (criptografado/placeholder): ${encryptedRefreshToken ? 'Presente' : 'Ausente/Null'}`);


    // 5. Prepara os dados para o UPDATE na tabela 'profiles'
    //    Certifique-se que os nomes das colunas aqui correspondem EXATAMENTE aos da sua tabela
    const profileUpdateData: {
        google_access_token: string; // Salva o access token (talvez criptografar também?)
        google_refresh_token?: string | null; // Salva o refresh token criptografado/placeholder
        google_token_expires_at?: string | null; // Opcional: Calcular expiração
        updated_at: string;
    } = {
        google_access_token: accessToken,
        updated_at: new Date().toISOString(),
    };

    // Inclui o refresh token apenas se ele foi fornecido e criptografado com sucesso (ou se o placeholder retornou algo)
    // Se refreshToken era null, encryptedRefreshToken será null.
    // Se refreshToken existia mas encryptToken falhou/retornou null, ele será salvo como null.
    if (refreshToken !== undefined) { // Verifica se a chave refreshToken veio no JSON (mesmo se null)
         profileUpdateData.google_refresh_token = encryptedRefreshToken;
    }

    // Opcional: Calcular e adicionar google_token_expires_at
    // const expiresInSeconds = 3599; // Google geralmente retorna 3600, damos uma pequena margem
    // const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    // profileUpdateData.google_token_expires_at = expiresAt.toISOString();
    // console.log(`Calculado google_token_expires_at: ${profileUpdateData.google_token_expires_at}`);


    // 6. Executa o UPDATE no banco de dados
    console.log(`Tentando atualizar perfil ID: ${userId}`);
    const { error: updateError } = await supabaseAdmin
      .from('profiles') // << CONFIRME O NOME DA TABELA
      .update(profileUpdateData)
      .eq('id', userId); // Garante que está atualizando o perfil correto

    // 7. Tratamento de Erro do Update
    if (updateError) {
      console.error(`Erro ao atualizar perfil para userId ${userId}:`, updateError);
      // Tratamento específico para perfil não encontrado (melhoria do Gemini)
       if (updateError.code === 'PGRST116') { // Código para 'Row not found'
         console.error(`Perfil não encontrado para userId ${userId}. O trigger handle_new_user pode não ter rodado.`);
         return new Response(
           JSON.stringify({ error: 'Perfil do usuário não encontrado. Garanta que o perfil é criado após o signup.' }),
           { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         )
       }
       // Lança outros erros do banco
      throw updateError;
    }

    console.log(`Perfil para userId ${userId} atualizado com sucesso com novos tokens.`);

    // 8. Retorna sucesso
    return new Response(
      JSON.stringify({ success: true, message: 'Tokens salvos com sucesso' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    // Captura erros gerais (ex: falha no req.json(), erro inesperado no Supabase client, erro lançado do update)
    console.error('Erro não tratado na Edge Function save-google-tokens:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


// supabase/functions/save-google-tokens/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Importa a função de criptografia (ajuste o caminho se necessário)
import { encrypt } from '../_shared/crypto-utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST',
}

console.log("Edge Function 'save-google-tokens' v2.0 inicializada."); // Adicione um versionamento/log

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
        status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  console.log("save-google-tokens: Recebida requisição POST.");

  try {
    const { userId, accessToken, refreshToken } = await req.json();
    console.log(`save-google-tokens: Dados recebidos - UserID: ${userId}, AccessToken: ${accessToken ? 'OK' : 'NÃO'}, RefreshToken: ${refreshToken ? 'OK' : 'NÃO'}`);

    if (!userId || !accessToken) {
      console.error('save-google-tokens: Inputs inválidos - userId ou accessToken faltando.');
      return new Response(JSON.stringify({ error: 'userId e accessToken são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY'); // Chave para criptografar

    if (!supabaseUrl || !supabaseServiceKey || !encryptionKey) {
        console.error("save-google-tokens: Variáveis de ambiente SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ou ENCRYPTION_KEY não encontradas.");
        return new Response(JSON.stringify({ error: 'Configuração do servidor incompleta' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    console.log("save-google-tokens: Cliente Supabase Admin inicializado.");

    // Criptografa o Refresh Token se ele existir
    let encryptedRefreshToken: string | null = null;
    if (refreshToken) {
        console.log("save-google-tokens: Criptografando refresh token...");
        encryptedRefreshToken = await encrypt(refreshToken, encryptionKey);
        if (!encryptedRefreshToken) {
            console.error("save-google-tokens: Falha ao criptografar o refresh token. Não será salvo.");
            // Decida se isso é um erro fatal ou se você salva o access token mesmo assim
            // Por segurança, se a criptografia falhar, talvez não salvar nada ou logar erro grave.
        } else {
            console.log("save-google-tokens: Refresh token criptografado com sucesso.");
        }
    }

    // Calcula a data de expiração do Access Token (Google geralmente retorna expires_in em segundos, padrão 3600)
    // Se o frontend não passar expires_in, usamos um padrão.
    // Idealmente, o frontend pegaria 'expires_in' do hash da URL e passaria para cá.
    const expiresInSeconds = 3599; // Assume 1 hora, menos 1 segundo de margem
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    const profileUpdateData: any = { // Use 'any' por flexibilidade ou defina um tipo mais estrito
        google_access_token: accessToken,
        google_token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
    };

    // Adiciona o refresh token ao update APENAS se ele foi fornecido e criptografado
    if (refreshToken && encryptedRefreshToken) {
         profileUpdateData.google_refresh_token = encryptedRefreshToken;
    } else if (refreshToken && !encryptedRefreshToken) {
        // Lidar com falha na criptografia - talvez não salvar o refresh token?
        console.warn("save-google-tokens: Refresh token fornecido mas criptografia falhou. Não será atualizado no perfil.");
    } else if (!refreshToken) {
        // Se nenhum refresh token foi enviado, explicitamente defina como null para limpar um antigo?
        // Ou deixe como está para não sobrescrever um refresh token existente se apenas o access token mudou.
        // profileUpdateData.google_refresh_token = null; // Descomente se quiser limpar refresh token se não vier um novo
    }


    console.log(`save-google-tokens: Tentando atualizar perfil ID: ${userId} com dados:`, Object.keys(profileUpdateData));
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', userId);

    if (updateError) {
      console.error(`save-google-tokens: Erro ao atualizar perfil para userId ${userId}:`, updateError);
       if (updateError.code === 'PGRST116') {
         return new Response(
           JSON.stringify({ error: 'Perfil do usuário não encontrado.' }),
           { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         )
       }
      throw updateError;
    }

    console.log(`save-google-tokens: Perfil para userId ${userId} atualizado com sucesso.`);
    return new Response(
      JSON.stringify({ success: true, message: 'Tokens salvos com sucesso' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('save-google-tokens: Erro não tratado:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

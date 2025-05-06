
// supabase/functions/google-refresh-token/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Importa a função de descriptografia
import { decrypt } from '../_shared/crypto-utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Idealmente, restrinja ao IP/domínio do N8N
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', // 'apikey' se o N8N usar a chave anon para chamar
  'Access-Control-Allow-Methods': 'POST',
};

console.log("Edge Function 'google-refresh-token' v1.0 inicializada.");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
        status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log("google-refresh-token: Recebida requisição POST.");

  try {
    const { userId } = await req.json(); // N8N deve enviar o userId
    console.log(`google-refresh-token: Recebido userId: ${userId}`);

    if (!userId) {
      console.error('google-refresh-token: userId é obrigatório.');
      return new Response(JSON.stringify({ error: 'userId é obrigatório' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Variáveis de Ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !googleClientId || !googleClientSecret || !encryptionKey) {
      console.error("google-refresh-token: Variáveis de ambiente incompletas.");
      return new Response(JSON.stringify({ error: 'Configuração do servidor incompleta' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    console.log("google-refresh-token: Cliente Supabase Admin inicializado.");

    // 1. Buscar o refresh token criptografado do perfil
    console.log(`google-refresh-token: Buscando perfil para userId: ${userId}`);
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('google_refresh_token') // Seleciona apenas o campo necessário
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error(`google-refresh-token: Erro ao buscar perfil ou perfil não encontrado para userId ${userId}:`, profileError);
      const status = profileError?.code === 'PGRST116' ? 404 : 500;
      return new Response(JSON.stringify({ error: 'Falha ao buscar dados do usuário ou usuário não encontrado.', details: profileError?.message }), {
        status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (!profile.google_refresh_token) {
      console.error(`google-refresh-token: Nenhum refresh token encontrado no perfil para userId ${userId}.`);
      return new Response(JSON.stringify({ error: 'Nenhum refresh token disponível para este usuário.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log("google-refresh-token: Refresh token criptografado obtido do perfil.");

    // 2. Descriptografar o refresh token
    console.log("google-refresh-token: Descriptografando refresh token...");
    const decryptedRefreshToken = await decrypt(profile.google_refresh_token, encryptionKey);

    if (!decryptedRefreshToken) {
      console.error(`google-refresh-token: Falha ao descriptografar o refresh token para userId ${userId}.`);
      return new Response(JSON.stringify({ error: 'Falha ao processar o refresh token armazenado.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log("google-refresh-token: Refresh token descriptografado com sucesso.");

    // 3. Chamar a API do Google para obter novo access token
    console.log("google-refresh-token: Solicitando novo access token do Google...");
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      refresh_token: decryptedRefreshToken,
      grant_type: 'refresh_token',
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("google-refresh-token: Erro do Google ao refrescar token:", tokenData);
      // Se o refresh token for inválido (ex: revogado), pode ser necessário limpar o refresh token do perfil
      if (tokenData.error === 'invalid_grant') {
          console.warn(`google-refresh-token: Refresh token inválido para userId ${userId}. Limpando do perfil.`);
          await supabaseAdmin.from('profiles').update({ google_refresh_token: null, google_access_token: null, google_token_expires_at: null }).eq('id', userId);
      }
      return new Response(JSON.stringify({ error: 'Falha ao obter novo access token do Google', details: tokenData.error_description || tokenData.error }), {
        status: tokenResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { access_token: newAccessToken, expires_in: newExpiresIn } = tokenData;
    console.log("google-refresh-token: Novo access token obtido com sucesso.");

    // 4. Calcular nova data de expiração
    const newExpiresAt = new Date(Date.now() + (newExpiresIn || 3599) * 1000); // Usa 3599s se expires_in não vier

    // 5. Atualizar o perfil com o novo access token e expiração
    console.log(`google-refresh-token: Atualizando perfil para userId ${userId} com novo access token e expiração.`);
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        google_access_token: newAccessToken,
        google_token_expires_at: newExpiresAt.toISOString(),
        updated_at: new Date().toISOString(),
        // Se o Google enviar um novo refresh_token (raro neste fluxo, mas possível), criptografe e atualize aqui.
        // if (tokenData.refresh_token) { ... }
      })
      .eq('id', userId);

    if (updateError) {
      console.error(`google-refresh-token: Erro ao atualizar perfil com novos tokens para userId ${userId}:`, updateError);
      // Não retorna o token novo se o salvamento falhar
      return new Response(JSON.stringify({ error: 'Falha ao salvar novos tokens no perfil', details: updateError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`google-refresh-token: Perfil para userId ${userId} atualizado com novo access token.`);

    // 6. Retornar o novo access token para o N8N
    return new Response(JSON.stringify({
        new_access_token: newAccessToken,
        expires_at: newExpiresAt.toISOString()
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('google-refresh-token: Erro não tratado:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor', details: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

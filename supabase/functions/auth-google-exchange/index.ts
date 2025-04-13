
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, redirectUrl } = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Código de autorização ausente' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Recebido código de autorização do Google:", code.substring(0, 10) + "...");
    console.log("URL de redirecionamento:", redirectUrl);

    // Inicializa cliente Supabase usando variáveis de ambiente
    const supabaseUrl = Deno.env.get('PROJECT_SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Variáveis de ambiente incompletas para Supabase");
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor incompleta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Configura OAuth para Google
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID') || '';
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';
    
    if (!googleClientId || !googleClientSecret) {
      console.error("Credenciais do Google incompletas");
      return new Response(
        JSON.stringify({ error: 'Configuração OAuth do Google incompleta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Troca o código de autorização por tokens
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUrl
    });

    console.log("Enviando solicitação de token para o Google...");
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Erro na resposta do Google:", tokenData);
      return new Response(
        JSON.stringify({ 
          error: 'Falha na troca de código por tokens', 
          details: tokenData.error_description || tokenData.error 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { access_token, refresh_token, id_token } = tokenData;
    console.log("Tokens obtidos com sucesso. Refresh token obtido:", !!refresh_token);

    // Obter informações do usuário
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const userInfo = await userInfoResponse.json();
    console.log("Informações do usuário obtidas:", userInfo.email);

    // Atualizar perfil do usuário com refresh_token
    const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: id_token,
    });

    if (authError || !authData.user) {
      console.error("Erro na autenticação com Supabase:", authError);
      return new Response(
        JSON.stringify({ error: 'Falha na autenticação com Supabase', details: authError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Usuário autenticado com Supabase:", authData.user.id);

    // Atualizar o perfil do usuário com o refresh_token
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        google_refresh_token: refresh_token,
        google_id: userInfo.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error("Erro ao atualizar perfil:", updateError);
      return new Response(
        JSON.stringify({ error: 'Falha ao salvar refresh token', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Perfil atualizado com sucesso para:", authData.user.email);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Autenticado com sucesso e refresh token armazenado',
        userId: authData.user.id,
        email: authData.user.email
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Erro não tratado:", error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

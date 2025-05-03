// Dentro de src/lib/supabase.ts

// Adicione esta função (ela chama a Edge Function)
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
    const { data, error } = await supabase.functions.invoke("save-google-tokens", {
      // Envia o ID do usuário e os tokens no body
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

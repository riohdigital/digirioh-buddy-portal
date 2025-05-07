
// Dentro da função attemptToSaveTokens, no arquivo src/hooks/useAuth.tsx

    const attemptToSaveTokens = async (currentSession: Session | null, eventType: string) => {
      // ... (logs e condições iniciais como antes) ...

      if (shouldSave) {
        console.log(`AuthProvider (${eventType}) LOG 1: Condições para salvar atendidas. Tentando salvar... AccessToken: ${currentSession!.access_token?.substring(0,10)}..., RefreshToken: ${currentSession!.provider_refresh_token ? 'Presente' : 'Ausente'}`);
        try {
          console.log(`${LOG_PREFIX} attemptToSaveTokens (${eventType}) [RUN ${effectRunRef.current}] Chamando saveGoogleTokens.`);
          await saveGoogleTokens({
            accessToken: currentSession!.provider_token!,
            refreshToken: currentSession!.provider_refresh_token || null,
          });
          if (isMounted) {
            tokensSavedForSessionRef.current = currentSession!.access_token!;
          }
          console.log(`AuthProvider (${eventType}) LOG 2: Salvamento de tokens BEM SUCEDIDO.`);
        } catch (error) {
          console.error(`AuthProvider (${eventType}) LOG 2.E: ERRO ao tentar salvar tokens do Google:`, error);
          // Continuamos mesmo com erro para não bloquear o fluxo de autenticação
        } finally {
          // Garante que mesmo em caso de erro, o aplicativo continua funcionando
          console.log(`AuthProvider (${eventType}) LOG 2.F: Finalizando chamada saveGoogleTokens, com ou sem sucesso.`);
          // Opcional: podemos registrar que houve uma falha no salvamento usando uma referência
          // para tentar novamente mais tarde ou mostrar um alerta para o usuário
        }
      } else {
        // ...
      }
      console.log(`AuthProvider (${eventType}) LOG 2.X: Fim de attemptToSaveTokens.`);
    };

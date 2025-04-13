import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Removido useSearchParams
import { exchangeGoogleAuthCode } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function AuthCallback() {
  // Removido useSearchParams
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // ----- INÍCIO DA MODIFICAÇÃO -----
        // Parse parameters from the URL fragment (#) instead of search params (?)
        const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove the leading '#'
        const code = hashParams.get("code");
        const errorParam = hashParams.get("error"); // Renomeado para evitar conflito com a variável 'error' do try-catch
        const errorDescription = hashParams.get("error_description");

        // Verifica se houve um erro retornado pelo Google no hash
        if (errorParam) {
            console.error(`Erro retornado na URL de callback: ${errorParam} - ${errorDescription}`);
            toast({
                title: "Erro de autenticação retornado",
                description: errorDescription || errorParam,
                variant: "destructive"
            });
            setStatus("error");
            setTimeout(() => navigate("/"), 3000); // Aumentar tempo para ler o erro
            return; // Interrompe a execução
        }

        // Verifica se o código existe (mesma verificação de antes, mas agora lendo do hash)
        if (!code) {
          console.error("Código de autorização não encontrado na URL (hash)");
          toast({
            title: "Erro de autenticação",
            description: "Código de autorização não encontrado",
            variant: "destructive"
          });
          setStatus("error");
          setTimeout(() => navigate("/"), 2000);
          return;
        }
        // ----- FIM DA MODIFICAÇÃO -----

        // Troca o código de autorização por tokens via Edge Function (sem alterações aqui)
        const result = await exchangeGoogleAuthCode(code);
        console.log("Autenticação completa:", result);

        toast({
          title: "Autenticação bem-sucedida",
          description: "Você foi autenticado com sucesso!"
        });

        setStatus("success");
        setTimeout(() => navigate("/dashboard"), 1000); // Redireciona para o dashboard

      } catch (error: any) { // Especifica 'any' ou um tipo mais específico para error
        console.error("Erro no processo de callback:", error);
        toast({
          title: "Erro de autenticação",
          // Tenta pegar a mensagem de erro, senão usa uma padrão
          description: error?.message || "Ocorreu um erro durante o processo de login",
          variant: "destructive"
        });

        setStatus("error");
        setTimeout(() => navigate("/"), 2000); // Redireciona para a home em caso de erro
      }
    };

    handleAuthCallback();
    // Removido searchParams das dependências
  }, [navigate, toast]);

  // ----- O JSX da interface continua o mesmo -----
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-digirioh-700">
          {status === "loading" && "Finalizando autenticação..."}
          {status === "success" && "Autenticação concluída!"}
          {status === "error" && "Erro na autenticação"}
        </h1>

        <div className="flex justify-center">
          {status === "loading" && (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-digirioh-500 border-t-transparent"></div>
          )}

          {status === "success" && (
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )}

          {status === "error" && (
            <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
        </div>

        <p className="text-center text-gray-600">
          {status === "loading" && "Processando suas credenciais..."}
          {status === "success" && "Redirecionando para o dashboard..."}
          {status === "error" && "Redirecionando para a página inicial..."}
        </p>
      </div>
    </div>
  );
}

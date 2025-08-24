
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import digiriohLogo from "@/assets/digirioh-logo.png";
import riohdigitalLogo from "@/assets/riohdigital-logo.png";

export default function Plans() {
  const { signInWithGoogle } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  useEffect(() => {
    // Here we would check the user's plan from Supabase
    // For now, we'll just set a dummy plan for display purposes
    setCurrentPlan("free");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-digirioh-50">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4 text-digirioh-800">Planos e Preços</h1>
          <p className="text-xl text-digirioh-600 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta às suas necessidades e potencialize seu uso do DigiRioh.
          </p>
          {currentPlan && (
            <div className="mt-6 inline-block px-4 py-2 bg-digirioh-100 text-digirioh-800 rounded-full">
              Seu plano atual: <span className="font-bold">{currentPlan === "free" ? "Gratuito" : "Pro"}</span>
            </div>
          )}
        </div>
      </section>
      
      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Free Plan */}
            <div className="w-full md:w-96 border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Plano Gratuito</h2>
                <p className="text-gray-500">Para começar a usar</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <PlanFeature text="Acesso básico ao DigiRioh" />
                <PlanFeature text="Gerenciamento de agenda" />
                <PlanFeature text="Leitura de emails" />
                <PlanFeature text="Consulta de contatos" />
                <PlanFeature text="Limite de 50 mensagens/dia" />
                <PlanFeature text="Buscas na web" />
                <PlanFeature text="Sem acesso a funcionalidades avançadas" included={false} />
                <PlanFeature text="Sem suporte prioritário" included={false} />
              </div>
              
              {currentPlan === "free" ? (
                <Button className="w-full bg-gray-300 hover:bg-gray-400 cursor-default" disabled>
                  Plano Atual
                </Button>
              ) : (
                <Button className="w-full" onClick={handleGoogleSignIn}>
                  Selecionar Plano
                </Button>
              )}
            </div>
            
            {/* Pro Plan */}
            <div className="w-full md:w-96 border-2 border-digirioh-500 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow relative">
              <div className="absolute top-0 right-0 bg-digirioh-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Popular
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Plano Pro</h2>
                <p className="text-gray-500">Para uso avançado</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 29,90</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <PlanFeature text="Tudo do plano gratuito" />
                <PlanFeature text="Mensagens ilimitadas" />
                <PlanFeature text="Acesso a todas as funcionalidades" />
                <PlanFeature text="Criação avançada de textos" />
                <PlanFeature text="Respostas com mais contexto" />
                <PlanFeature text="Prioridade nas respostas" />
                <PlanFeature text="Disponibilidade de funções em lançamento" />
                <PlanFeature text="Suporte prioritário" />
              </div>
              
              {currentPlan === "pro" ? (
                <Button className="w-full bg-gray-300 hover:bg-gray-400 cursor-default" disabled>
                  Plano Atual
                </Button>
              ) : (
                <Button className="w-full bg-digirioh-600 hover:bg-digirioh-700" onClick={handleGoogleSignIn}>
                  Selecionar Plano
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Todos os planos incluem acesso ao DigiRioh via WhatsApp. A cobrança é mensal e você pode cancelar a qualquer momento.
              Para mais detalhes sobre os recursos incluídos em cada plano, entre em contato conosco.
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-16 bg-digirioh-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Perguntas Frequentes</h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Como faço para mudar de plano?</h3>
              <p className="text-gray-600">
                Você pode mudar de plano a qualquer momento através do seu painel no site. 
                A mudança é imediata para upgrades e no final do período de cobrança para downgrades.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">O que acontece quando atinjo o limite de mensagens do plano gratuito?</h3>
              <p className="text-gray-600">
                Quando você atinge o limite de 50 mensagens diárias no plano gratuito, 
                o DigiRioh informará que você atingiu seu limite e sugerirá um upgrade para o plano Pro.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Posso usar o DigiRioh em vários dispositivos?</h3>
              <p className="text-gray-600">
                Sim! O DigiRioh está associado ao seu número de WhatsApp e conta Google, então você pode 
                acessá-lo de qualquer dispositivo onde estiver logado nessas contas.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Como são processados os meus dados?</h3>
              <p className="text-gray-600">
                Sua privacidade é importante para nós. O DigiRioh acessa apenas os dados necessários para 
                fornecer os serviços solicitados e não armazena conteúdo de emails ou mensagens além do 
                necessário para funcionamento. Consulte nossa política de privacidade para mais detalhes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 mt-auto">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={digiriohLogo} alt="DigiRioh" className="h-10 w-10" />
                <span className="text-2xl font-bold text-foreground">DigiRioh</span>
              </div>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Seu assistente digital com jeitinho brasileiro para te ajudar no dia a dia. 
                Simples, rápido e sempre disponível no seu WhatsApp.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-foreground">Links</h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                <li><a href="/features" className="text-muted-foreground hover:text-primary transition-colors">Funcionalidades</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} DigiRioh. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Desenvolvido por</span>
                <img src={riohdigitalLogo} alt="Rioh Digital" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PlanFeature({ text, included = true }: { text: string; included?: boolean }) {
  return (
    <div className="flex items-center">
      {included ? (
        <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
      ) : (
        <div className="h-5 w-5 text-gray-300 mr-3 flex items-center justify-center">
          <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
        </div>
      )}
      <p className={included ? "text-gray-700" : "text-gray-400"}>{text}</p>
    </div>
  );
}

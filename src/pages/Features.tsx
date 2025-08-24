
import { Navbar } from "@/components/Navbar";
import { Calendar, Mail, Users, PenLine, Coins, Clock, Globe, Calculator, MessageSquare, Smartphone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import digiriohLogo from "@/assets/digirioh-logo.png";
import riohdigitalLogo from "@/assets/riohdigital-logo.png";

export default function Features() {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-digirioh-50">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4 text-digirioh-800">Funcionalidades do DigiRioh</h1>
          <p className="text-xl text-digirioh-600 max-w-2xl mx-auto">
            Conheça tudo o que o DigiRioh pode fazer para facilitar seu dia a dia, direto do seu WhatsApp.
          </p>
        </div>
      </section>
      
      {/* Google Connection */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-digirioh-800">Conexão com Google</h2>
              <p className="text-lg text-gray-600 mb-6">
                A conexão com o Google é o método de acesso ao DigiRioh e também habilita as funcionalidades de agenda e email.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Com apenas um clique, você autoriza o DigiRioh a acessar sua agenda e emails, permitindo que ele te ajude a gerenciar compromissos e mensagens.
              </p>
              <Button 
                onClick={handleGoogleSignIn} 
                size="lg"
                className="text-lg px-6 py-5 bg-digirioh-600 hover:bg-digirioh-700"
              >
                Conectar com Google
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="rounded-xl bg-white shadow-xl p-6 border border-gray-200 max-w-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Acesso ao Gmail</h3>
                      <p className="text-sm text-gray-500">Gerencie emails sem sair do WhatsApp</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Acesso ao Google Calendar</h3>
                      <p className="text-sm text-gray-500">Consulte e crie eventos facilmente</p>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* WhatsApp Connection */}
      <section className="py-16 bg-digirioh-50">
        <div className="container">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-digirioh-800">Conexão com WhatsApp</h2>
              <p className="text-lg text-gray-600 mb-6">
                Após conectar com Google, vincule sua conta ao WhatsApp para receber assistência diretamente no seu celular.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                É simples: gere um código no portal e envie para o número do DigiRioh no WhatsApp. Pronto! Seu assistente estará disponível 24/7.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-96 rounded-3xl bg-white shadow-xl p-4 border border-digirioh-100">
                <div className="w-full h-8 bg-whatsapp flex items-center px-2 rounded-t-lg">
                  <div className="h-3 w-3 rounded-full bg-white mr-2"></div>
                  <span className="text-white text-xs font-medium">DigiRioh</span>
                </div>
                <div className="h-full overflow-hidden rounded-b-lg bg-whatsapp-light p-3">
                  <div className="bg-white rounded-lg p-3 mb-3 inline-block max-w-[80%]">
                    <p className="text-sm">Para conectar sua conta, envie o código: <strong>123456</strong></p>
                  </div>
                  <div className="bg-digirioh-100 rounded-lg p-3 mb-3 inline-block max-w-[80%] ml-auto">
                    <p className="text-sm">123456</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 mb-3 inline-block max-w-[80%]">
                    <p className="text-sm">Conta conectada com sucesso! Agora você pode usar todas as funcionalidades do DigiRioh.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Details */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center text-digirioh-800">Detalhes das Funcionalidades</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureDetailCard 
              icon={Calendar} 
              title="Agenda Inteligente" 
              description="Consulte seus compromissos, crie novos eventos e receba lembretes diretamente no WhatsApp. 'DigiRioh, quais são meus compromissos de hoje?'"
            />
            <FeatureDetailCard 
              icon={Mail} 
              title="Gerenciamento de Email" 
              description="Leia, responda e organize seus emails sem abrir o Gmail. 'DigiRioh, tenho emails novos hoje?'"
            />
            <FeatureDetailCard 
              icon={Users} 
              title="Gestão de Contatos" 
              description="Encontre e gerencie seus contatos facilmente. 'DigiRioh, qual é o email do João?'"
            />
            <FeatureDetailCard 
              icon={PenLine} 
              title="Criação de Conteúdo" 
              description="Ajuda para escrever mensagens, documentos e textos criativos. 'DigiRioh, escreva um email para um cliente sobre atraso na entrega'"
            />
            <FeatureDetailCard 
              icon={Globe} 
              title="Informações em Tempo Real" 
              description="Pesquise informações na web sem sair do WhatsApp. 'DigiRioh, qual a previsão do tempo para amanhã?'"
            />
            <FeatureDetailCard 
              icon={Calculator} 
              title="Calculadora Inteligente" 
              description="Resolva cálculos matemáticos e conversões rapidamente. 'DigiRioh, quanto é 15% de 230?'"
            />
            <FeatureDetailCard 
              icon={MapPin} 
              title="Localizações e Direções" 
              description="Encontre endereços e obtenha direções facilmente. 'DigiRioh, como chego ao Shopping Ibirapuera?'"
            />
            <FeatureDetailCard 
              icon={Smartphone} 
              title="Disponível 24/7" 
              description="Seu assistente está sempre disponível quando você precisar, basta enviar uma mensagem no WhatsApp."
            />
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Todas essas funcionalidades são acessíveis após conectar sua conta Google e vincular seu WhatsApp.
            </p>
            <Button 
              onClick={handleGoogleSignIn} 
              size="lg"
              className="text-lg px-6 py-5 bg-digirioh-600 hover:bg-digirioh-700"
            >
              Começar Agora com Google
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
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
                <li><a href="/plans" className="text-muted-foreground hover:text-primary transition-colors">Planos</a></li>
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

function FeatureDetailCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-digirioh-100 shrink-0">
          <Icon className="h-6 w-6 text-digirioh-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-digirioh-800">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

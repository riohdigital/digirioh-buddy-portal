import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, Mail, Users, PenLine, Coins, 
  Clock, Globe, Calculator, MessageSquare 
} from "lucide-react";
import digiriohLogo from "@/assets/digirioh-logo.png";
import digiriohLogoRedondo from "@/assets/digirioh-logo-redondo.png";
import riohdigitalLogo from "@/assets/riohdigital-logo.png";

export default function Index() {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    console.log("Botão 'Conectar com Google' clicado");
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient min-h-screen flex items-center">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <img src={digiriohLogo} alt="DigiRioh" className="h-24 w-24 animate-float" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight">
                Seu assistente digital com 
                <span className="text-primary"> jeitinho brasileiro</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Gerencie sua vida digital sem sair do WhatsApp. O DigiRioh organiza sua agenda, envia seus e-mails e busca seus contatos, tudo através de uma simples conversa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={handleGoogleSignIn} 
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  Conectar com Google
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6"
                  asChild
                >
                  <a href="#features">Ver Funcionalidades</a>
                </Button>
              </div>
            </div>
          
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-[500px] rounded-3xl bg-card shadow-2xl p-6 border border-border animate-float flex flex-col">
                  <div className="w-full h-12 bg-primary flex items-center px-4 rounded-t-2xl mb-4 flex-shrink-0">
                    <img src={digiriohLogoRedondo} alt="DigiRioh" className="h-8 w-8 mr-3" />
                    <span className="text-primary-foreground font-medium">DigiRioh</span>
                    <div className="ml-auto flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary-foreground/60"></div>
                      <div className="h-2 w-2 rounded-full bg-primary-foreground/60"></div>
                      <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto bg-gray-50 rounded-b-2xl p-4 space-y-4">
                    <div className="bg-white rounded-2xl p-4 shadow-sm max-w-[85%]">
                      <p className="text-sm text-slate-800">E aí! 👋 Sou o DigiRioh, tudo bem?</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm max-w-[85%]">
                      <p className="text-sm text-slate-800">Como posso te ajudar hoje?</p>
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-2xl p-4 shadow-sm max-w-[85%] ml-auto">
                      <p className="text-sm">Quero ver minha agenda de amanhã!</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm max-w-[85%]">
                      <p className="text-sm font-medium text-slate-900">Claro! Você tem 3 compromissos amanhã:</p>
                      <div className="mt-2 space-y-1 text-slate-700">
                        <p className="text-sm">📅 9:00 - Reunião de equipe</p>
                        <p className="text-sm">🏥 14:30 - Médico</p>
                        <p className="text-sm">🍽️ 19:00 - Jantar com amigos</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Tô pronto pra te ajudar a organizar:
            </h2>
            <p className="text-xl text-muted-foreground">
              Descubra tudo que posso fazer por você, direto no seu WhatsApp
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              title="Sua Agenda" 
              icon={Calendar} 
              description="Nunca mais perca um compromisso. Agende, cancele e consulte seus eventos com uma mensagem." 
            />
            <FeatureCard 
              title="Seus E-mails" 
              icon={Mail} 
              description="Leia, responda e envie e-mails sem precisar abrir sua caixa de entrada. A produtividade na palma da sua mão." 
            />
            <FeatureCard 
              title="Seus Contatos" 
              icon={Users} 
              description="Precisa de um e-mail ou telefone? Peça ao DigiRioh para buscar em seus contatos e agilizar suas tarefas." 
            />
            <FeatureCard 
              title="Criação de Textos" 
              icon={PenLine} 
              description="Sem inspiração? Peça ajuda para criar rascunhos de e-mails, posts para redes sociais ou qualquer texto." 
            />
            <FeatureCard 
              title="Suas Finanças" 
              icon={Coins} 
              description="Acompanhe seus gastos e receitas de forma inteligente e conversacional." 
            />
            <FeatureCard 
              title="Mestre do Tempo" 
              icon={Clock} 
              description="Verifique a previsão do tempo para qualquer lugar, a qualquer hora." 
            />
            <FeatureCard 
              title="Buscas na Web" 
              icon={Globe} 
              description="Obtenha respostas e informações da internet sem sair do seu chat." 
            />
            <FeatureCard 
              title="Cálculos Rápidos" 
              icon={Calculator} 
              description="Precisa fazer uma conta rápida? É só me perguntar!" 
            />
            <FeatureCard 
              title="E muito mais!" 
              icon={MessageSquare} 
              description="Minhas habilidades estão sempre evoluindo. É só me pedir, e eu faço acontecer! 😉" 
            />
          </div>
          
          <div className="mt-20">
            <div className="bg-primary/5 rounded-3xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Pronto para começar?</h3>
              <p className="text-muted-foreground mb-6">
                Conecte sua conta Google e comece a usar o DigiRioh agora mesmo!
              </p>
              <Button 
                onClick={handleGoogleSignIn} 
                size="lg"
                className="text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                Começar Agora com Google
              </Button>
            </div>
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
                <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Funcionalidades</a></li>
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
                &copy; {new Date().getFullYear()} Rioh Digital A.I & Automations Solutions. Todos os direitos reservados.
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

// Componente auxiliar para os cards de funcionalidades
function FeatureCard({ 
  title, 
  icon: Icon, 
  description, 
  comingSoon = false 
}: { 
  title: string;
  icon: React.ElementType;
  description: string;
  comingSoon?: boolean;
}) {
  return (
    <div className={`p-8 rounded-2xl border feature-card ${
      comingSoon 
        ? 'border-border bg-muted/50 opacity-75' 
        : 'border-border bg-card shadow-lg hover:shadow-xl transform hover:-translate-y-2'
    } transition-all duration-300`}>
      <div className="flex justify-center mb-6">
        <div className={`p-4 rounded-2xl ${
          comingSoon ? 'bg-muted' : 'bg-primary/10'
        }`}>
          <Icon className={`h-10 w-10 ${
            comingSoon ? 'text-muted-foreground' : 'text-primary'
          }`} />
        </div>
      </div>
      <h3 className={`text-xl font-bold mb-3 ${
        comingSoon ? 'text-muted-foreground' : 'text-foreground'
      }`}>
        {title}
      </h3>
      <p className={`text-base leading-relaxed ${
        comingSoon ? 'text-muted-foreground' : 'text-muted-foreground'
      }`}>
        {description}
      </p>
      {comingSoon && (
        <div className="mt-4">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
            Em breve
          </span>
        </div>
      )}
    </div>
  );
}

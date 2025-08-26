
import { Navbar } from "@/components/Navbar";
import { Calendar, Mail, Users, PenLine, Coins, Clock, Globe, Calculator, MessageSquare, Smartphone, MapPin, CheckSquare, ContactRound } from "lucide-react";
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
      <section className="pt-32 pb-16 hero-gradient">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Funcionalidades do DigiRioh</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça tudo o que o DigiRioh pode fazer para facilitar seu dia a dia, direto do seu WhatsApp.
          </p>
        </div>
      </section>
      
      {/* Google Connection */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Conecte com seu Google
            </h2>
            <p className="text-xl text-muted-foreground">
              Para acessar todas as funcionalidades, você precisa conectar sua conta Google. 
              É rápido, seguro e você mantém controle total dos seus dados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="p-8 rounded-2xl border feature-card border-border bg-card shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/10">
                  <Mail className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground text-center">Acesso ao Gmail</h3>
              <p className="text-muted-foreground text-center">
                Leio, respondo e envio e-mails para você. Nunca mais perca mensagens importantes.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl border feature-card border-border bg-card shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/10">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground text-center">Acesso ao Google Calendar</h3>
              <p className="text-muted-foreground text-center">
                Gerencio sua agenda completa. Criação, edição e consulta de eventos de forma inteligente.
              </p>
            </div>

            <div className="p-8 rounded-2xl border feature-card border-border bg-card shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/10">
                  <CheckSquare className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground text-center">Acesso ao Google Tasks</h3>
              <p className="text-muted-foreground text-center">
                Cuido da sua lista de afazeres. Adicione, complete e delete tarefas com comandos simples.
              </p>
            </div>

            <div className="p-8 rounded-2xl border feature-card border-border bg-card shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/10">
                  <ContactRound className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground text-center">Acesso ao Google Contacts</h3>
              <p className="text-muted-foreground text-center">
                Sua agenda de contatos sempre à mão. Busco telefones, e-mails e crio novos contatos.
              </p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <Smartphone className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">Conecte via WhatsApp</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Depois de conectar com Google, você receberá instruções para vincular o DigiRioh ao seu WhatsApp. 
                É seguro e você pode desconectar a qualquer momento.
              </p>
              <Button 
                onClick={handleGoogleSignIn} 
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Conectar Agora
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      
      {/* Features Details */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Detalhes das Funcionalidades</h2>
          
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
              className="text-lg px-6 py-5 bg-primary hover:bg-primary/90 text-primary-foreground"
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
    <div className="p-8 rounded-2xl border feature-card border-border bg-card shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-primary/10 shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

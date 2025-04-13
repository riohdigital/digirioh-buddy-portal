
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, Mail, Users, PenLine, Coins, 
  Clock, Globe, Calculator, MessageSquare 
} from "lucide-react";

export default function Index() {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    console.log("Botão 'Conectar com Google' clicado"); // Adicione esta linha
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-pattern">
        <div className="container flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl font-extrabold text-digirioh-900">
              Seu assistente digital com jeitinho brasileiro
            </h1>
            <p className="text-xl text-digirioh-700 max-w-md">
              DigiRioh é seu assistente de IA para WhatsApp, ajudando com sua agenda, emails, contatos e muito mais!
            </p>
            <Button 
              onClick={handleGoogleSignIn} 
              size="lg"
              className="text-lg px-8 py-6 bg-digirioh-600 hover:bg-digirioh-700"
            >
              Conectar com Google
            </Button>
          </div>
          
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <div className="relative w-64 h-96 rounded-3xl bg-white shadow-xl p-4 border border-digirioh-100 animate-float">
              <div className="w-full h-8 bg-whatsapp flex items-center px-2 rounded-t-lg">
                <div className="h-3 w-3 rounded-full bg-white mr-2"></div>
                <span className="text-white text-xs font-medium">DigiRioh</span>
              </div>
              <div className="h-full overflow-hidden rounded-b-lg bg-whatsapp-light p-3">
                <div className="bg-white rounded-lg p-3 mb-3 inline-block max-w-[80%]">
                  <p className="text-sm">E aí! 👋 Sou o DigiRioh, tudo bem?</p>
                </div>
                <div className="bg-white rounded-lg p-3 mb-3 inline-block max-w-[80%]">
                  <p className="text-sm">Como posso te ajudar hoje?</p>
                </div>
                <div className="bg-digirioh-100 rounded-lg p-3 mb-3 inline-block max-w-[80%] ml-auto">
                  <p className="text-sm">Quero ver minha agenda de amanhã!</p>
                </div>
                <div className="bg-white rounded-lg p-3 mb-3 inline-block max-w-[80%]">
                  <p className="text-sm">Claro! Você tem 3 compromissos amanhã:</p>
                  <p className="text-sm mt-1">9:00 - Reunião de equipe</p>
                  <p className="text-sm">14:30 - Médico</p>
                  <p className="text-sm">19:00 - Jantar com amigos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-12">Tô pronto pra te ajudar a organizar:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Sua Agenda" 
              icon={Calendar} 
              description="Acesso fácil aos seus compromissos e eventos" 
            />
            <FeatureCard 
              title="Seus E-mails" 
              icon={Mail} 
              description="Gerencie suas mensagens sem abrir o Gmail" 
            />
            <FeatureCard 
              title="Seus Contatos" 
              icon={Users} 
              description="Encontre e gerencie contatos rapidamente" 
            />
            <FeatureCard 
              title="Criação de Textos" 
              icon={PenLine} 
              description="Ajuda para escrever mensagens e documentos" 
            />
            <FeatureCard 
              title="Suas Finanças" 
              icon={Coins} 
              description="Em breve!" 
              comingSoon 
            />
            <FeatureCard 
              title="Mestre do Tempo" 
              icon={Clock} 
              description="Em breve!" 
              comingSoon 
            />
            <FeatureCard 
              title="Buscas na Web" 
              icon={Globe} 
              description="Informações sem sair do WhatsApp" 
            />
            <FeatureCard 
              title="Cálculos Rápidos" 
              icon={Calculator} 
              description="Resolva operações matemáticas facilmente" 
            />
            <FeatureCard 
              title="E muito mais!" 
              icon={MessageSquare} 
              description="É só me pedir, e eu faço acontecer! 😉" 
            />
          </div>
          
          <div className="mt-16">
            <Button 
              onClick={handleGoogleSignIn} 
              size="lg"
              className="text-lg px-8 py-6 bg-digirioh-600 hover:bg-digirioh-700"
            >
              Começar Agora com Google
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-digirioh-900 text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <MessageSquare className="h-6 w-6" />
                <span>DigiRioh</span>
              </div>
              <p className="mt-2 text-digirioh-100 max-w-xs">
                Seu assistente digital com jeitinho brasileiro para te ajudar no dia a dia.
              </p>
            </div>
            
            <div className="mt-8 md:mt-0 grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4">Links</h3>
                <ul className="space-y-2">
                  <li><a href="/features" className="hover:text-digirioh-300">Funcionalidades</a></li>
                  <li><a href="/plans" className="hover:text-digirioh-300">Planos</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-digirioh-300">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-digirioh-300">Privacidade</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-digirioh-800 text-center text-sm text-digirioh-300">
            &copy; {new Date().getFullYear()} DigiRioh. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

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
    <div className={`p-6 rounded-xl border ${
      comingSoon ? 'border-gray-200 bg-gray-50' : 'border-digirioh-100 bg-white'
    } shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-full ${
          comingSoon ? 'bg-gray-200' : 'bg-digirioh-100'
        }`}>
          <Icon className={`h-8 w-8 ${
            comingSoon ? 'text-gray-500' : 'text-digirioh-600'
          }`} />
        </div>
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${
        comingSoon ? 'text-gray-500' : 'text-digirioh-800'
      }`}>
        {title}
      </h3>
      <p className={`${comingSoon ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
  );
}

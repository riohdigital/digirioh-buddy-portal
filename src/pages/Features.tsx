import { Navbar } from "@/components/Navbar";
import { 
  Calendar, Mail, Users, PenLine, Coins, Clock, Globe, Calculator, 
  MessageSquare, Smartphone, MapPin, CheckSquare, ContactRound, 
  Mic, Image, Plane, ShoppingCart, CloudRain, DollarSign, Bot, Eye, Zap
} from "lucide-react";
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
      
      {/* Google Connection - Layout Original Melhorado */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              🔗 Conecte com seu Google
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Para acessar todas as funcionalidades, você precisa conectar sua conta Google. 
              É rápido, seguro e você mantém controle total dos seus dados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 rounded-xl border border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="mb-4">
                <div className="p-3 rounded-full bg-red-100 w-fit mx-auto">
                  <Mail className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Gmail</h3>
              <p className="text-sm text-muted-foreground">
                Leio, respondo e envio e-mails para você
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="mb-4">
                <div className="p-3 rounded-full bg-blue-100 w-fit mx-auto">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Google Calendar</h3>
              <p className="text-sm text-muted-foreground">
                Gerencio sua agenda completa
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="mb-4">
                <div className="p-3 rounded-full bg-green-100 w-fit mx-auto">
                  <CheckSquare className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Google Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Cuido da sua lista de afazeres
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="mb-4">
                <div className="p-3 rounded-full bg-purple-100 w-fit mx-auto">
                  <ContactRound className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Google Contacts</h3>
              <p className="text-sm text-muted-foreground">
                Sua agenda de contatos sempre à mão
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
      
      
      {/* Features Details - Funcionalidades Completas */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-center text-foreground">Todas as Funcionalidades</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Descubra tudo o que o DigiRioh pode fazer para transformar sua produtividade
          </p>
          
          {/* Comunicação Inteligente */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-foreground">🎙️ Comunicação Inteligente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureDetailCard 
                icon={Mic} 
                iconColor="bg-orange-100 text-orange-600"
                title="Pode Falar, eu te escuto!" 
                description="Está ocupado ou simplesmente não quer digitar? Me mande um áudio! Eu transcrevo, entendo e executo o que você pediu. Perfeito para quando você está no trânsito ou com as mãos ocupadas."
              />
              <FeatureDetailCard 
                icon={Eye} 
                iconColor="bg-cyan-100 text-cyan-600"
                title="Meus Olhos Digitais" 
                description="Envie prints, fotos de documentos ou imagens. Precisa registrar um gasto de um comprovante? Agendar um evento a partir de um convite? Eu leio a imagem, extraio as informações e faço o trabalho para você."
              />
            </div>
          </div>

          {/* Organização Pessoal */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-foreground">📋 Organização Pessoal e Produtividade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureDetailCard 
                icon={Calendar} 
                iconColor="bg-blue-100 text-blue-600"
                title="Gerente de Agenda Proativo" 
                description="Eu não apenas marco seus compromissos. Eu entendo seus e-mails e sugiro horários, crio eventos recorrentes, adiciono lembretes inteligentes e garanto que sua agenda trabalhe para você."
              />
              <FeatureDetailCard 
                icon={Mail} 
                iconColor="bg-red-100 text-red-600"
                title="Seu Filtro de E-mails Inteligente" 
                description="Chega de caixa de entrada lotada! Eu posso ler seus e-mails, resumir os importantes, redigir respostas e até mesmo encontrar aquele anexo perdido de meses atrás."
              />
              <FeatureDetailCard 
                icon={ContactRound} 
                iconColor="bg-purple-100 text-purple-600"
                title="Sua Agenda de Contatos" 
                description="Precisa do telefone de alguém? Eu busco para você. Conheceu alguém novo? Me fale e eu crio o contato, sincronizado com sua conta Google."
              />
              <FeatureDetailCard 
                icon={CheckSquare} 
                iconColor="bg-green-100 text-green-600"
                title="Gerente de Tarefas" 
                description="Eu cuido da sua lista de afazeres no Google Tasks. Adicione, complete e delete tarefas com um simples comando de voz ou texto."
              />
            </div>
          </div>

          {/* Planejamento */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-foreground">✈️ Planejamento e Estilo de Vida</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureDetailCard 
                icon={Plane} 
                iconColor="bg-sky-100 text-sky-600"
                title="Concierge de Viagens (HYPERION)" 
                description="Este é meu módulo mais avançado. Eu planejo suas viagens do zero, encontrando voos, hotéis estrategicamente localizados perto das atrações do seu interesse, e monto um roteiro completo e otimizado."
              />
              <FeatureDetailCard 
                icon={DollarSign} 
                iconColor="bg-emerald-100 text-emerald-600"
                title="Seu Consultor Financeiro" 
                description="Eu te ajudo a registrar despesas e receitas, agendar contas a pagar e te dou uma visão clara da sua saúde financeira."
              />
              <FeatureDetailCard 
                icon={ShoppingCart} 
                iconColor="bg-pink-100 text-pink-600"
                title="Assistente de Compras" 
                description="Diga o que precisa e eu monto sua lista de mercado ou de desejos, buscando até preços aproximados para você ter uma ideia."
              />
            </div>
          </div>

          {/* Ferramentas do Dia a Dia */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-foreground">🛠️ Ferramentas do Dia a Dia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureDetailCard 
                icon={Globe} 
                iconColor="bg-indigo-100 text-indigo-600"
                title="Pesquisador Veloz" 
                description="Qualquer dúvida, eu busco na web e te trago a resposta resumida."
              />
              <FeatureDetailCard 
                icon={PenLine} 
                iconColor="bg-amber-100 text-amber-600"
                title="Criador de Conteúdo" 
                description="Precisa de um texto para post, um e-mail formal ou uma legenda criativa? Me dê o tema e eu crio para você."
              />
              <FeatureDetailCard 
                icon={CloudRain} 
                iconColor="bg-slate-100 text-slate-600"
                title="Meteorologista de Bolso" 
                description="Saiba a previsão do tempo para qualquer lugar, a qualquer hora."
              />
              <FeatureDetailCard 
                icon={Calculator} 
                iconColor="bg-teal-100 text-teal-600"
                title="Calculadora e Conversor" 
                description="Cálculos rápidos, conversão de moedas ou unidades? É pra já!"
              />
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Todas essas funcionalidades são acessíveis após conectar sua conta Google e vincular seu WhatsApp.
            </p>
            <Button 
              onClick={handleGoogleSignIn} 
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
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
  description,
  iconColor = "bg-primary/10 text-primary"
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor?: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
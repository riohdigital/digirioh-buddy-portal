import { Navbar } from "@/components/Navbar";
import { MessageSquare } from "lucide-react";
import digiriohLogo from "@/assets/digirioh-logo.png";
import riohdigitalLogo from "@/assets/riohdigital-logo.png";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-background">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Política de Privacidade</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Como coletamos, usamos e protegemos suas informações pessoais
          </p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-background rounded-3xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Política de Privacidade do DigiRioh App</h2>
              <p className="text-muted-foreground mb-6"><strong>Última Atualização:</strong> 24/08/2025</p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">1. Nosso Compromisso com a Privacidade</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    O DigiRioh App ("Serviço"), de propriedade da Rioh Digital AI Solutions ("nós", "nosso"), valoriza sua privacidade. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais ("Informações Pessoais") quando você utiliza nosso portal web e serviços de assistência via WhatsApp (coletivamente, os "Serviços"), em conformidade com as leis de proteção de dados aplicáveis, como a LGPD e o GDPR.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">2. Informações que Coletamos</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Coletamos apenas as informações estritamente necessárias para fornecer e melhorar nossos Serviços:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground">Informações de Cadastro:</h4>
                      <p className="text-muted-foreground">Ao criar sua conta através de um provedor de autenticação (como o Google), recebemos informações básicas de perfil, como seu nome e endereço de e-mail.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Informações de Conexão com Serviços de Terceiros:</h4>
                      <p className="text-muted-foreground">Para habilitar funcionalidades essenciais, você pode optar por conectar sua conta a serviços de terceiros (ex: Google). Com sua autorização explícita, podemos acessar dados relevantes desses serviços, como informações de e-mail, calendário e contatos, estritamente para executar as tarefas que você nos solicita. Nosso uso de informações recebidas de APIs de terceiros, como as do Google, adere rigorosamente às suas políticas de dados de usuário, incluindo os Requisitos de Uso Limitado.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Conteúdo de Uso:</h4>
                      <p className="text-muted-foreground">Coletamos as mensagens e comandos que você envia ao assistente via WhatsApp para processar suas solicitações.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Informações Técnicas:</h4>
                      <p className="text-muted-foreground">Coletamos informações técnicas básicas, como seu identificador de usuário no WhatsApp (JID) para associar as conversas à sua conta, e dados de cookies em nosso website para gerenciar sua sessão de login.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">3. Como Usamos Suas Informações</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Suas Informações Pessoais são usadas exclusivamente para:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground">Operar e Fornecer os Serviços:</h4>
                      <p className="text-muted-foreground">Autenticar sua conta, processar seus comandos e interagir com suas contas de terceiros conectadas conforme suas instruções.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Melhorar os Serviços:</h4>
                      <p className="text-muted-foreground">Analisar dados de uso de forma anônima ou agregada para aprimorar a funcionalidade e a experiência do usuário.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Comunicação:</h4>
                      <p className="text-muted-foreground">Enviar notificações importantes sobre sua conta e responder a solicitações de suporte.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Segurança:</h4>
                      <p className="text-muted-foreground">Proteger nossos sistemas, prevenir fraudes e garantir a integridade dos Serviços.</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Não utilizamos seus dados pessoais de serviços de terceiros, como o conteúdo de seus e-mails ou eventos de calendário, para fins de publicidade.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">4. Compartilhamento de Informações</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Não vendemos suas Informações Pessoais. Podemos compartilhar informações limitadas com:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground">Provedores de Serviços Essenciais:</h4>
                      <p className="text-muted-foreground">Terceiros que nos fornecem infraestrutura tecnológica (como hospedagem, bancos de dados e APIs de inteligência artificial) para operar os Serviços. Eles são contratualmente obrigados a proteger suas informações e a usá-las apenas para os fins que especificamos.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Obrigações Legais:</h4>
                      <p className="text-muted-foreground">Se exigido por lei ou em resposta a um processo legal válido, podemos divulgar suas informações a autoridades competentes.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">5. Seus Direitos de Proteção de Dados</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Você tem o direito de acessar, corrigir, excluir ou transferir suas Informações Pessoais. Você também pode revogar seu consentimento para o processamento de dados a qualquer momento, o que pode impactar nossa capacidade de fornecer certas funcionalidades. Para exercer seus direitos, entre em contato conosco.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">6. Segurança e Retenção de Dados</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo o uso de criptografia para dados sensíveis em repouso e em trânsito. Retemos suas informações apenas pelo tempo necessário para fornecer os Serviços ou para cumprir nossas obrigações legais.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">7. Alterações a Esta Política</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Podemos atualizar esta Política de Privacidade periodicamente. Publicaremos a versão atualizada em nosso site com a nova data de "Última Atualização". O uso continuado dos Serviços após uma atualização constitui sua aceitação dos novos termos.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">8. Contato</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Se tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: <a href="mailto:riohdigital@gmail.com" className="text-primary hover:underline">riohdigital@gmail.com</a>.
                  </p>
                  <p className="text-muted-foreground mt-4 font-medium">
                    Rioh Digital AI Solutions
                  </p>
                </div>
              </div>
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
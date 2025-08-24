import { Navbar } from "@/components/Navbar";
import { MessageSquare } from "lucide-react";
import digiriohLogo from "@/assets/digirioh-logo.png";
import riohdigitalLogo from "@/assets/riohdigital-logo.png";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-background">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Termos de Serviço</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Termos e condições de uso do DigiRioh App
          </p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-background rounded-3xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Termos de Serviço do DigiRioh App</h2>
              <p className="text-muted-foreground mb-6"><strong>Última Atualização:</strong> 24/08/2025</p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">1. Aceitação dos Termos</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ao acessar e utilizar o DigiRioh App ("Serviço"), operado pela Rioh Digital AI Solutions ("nós", "nossa", "nosso"), você concorda em ficar vinculado a estes Termos de Serviço ("Termos"). Se você não concordar com qualquer parte destes termos, não deverá usar nosso serviço.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">2. Descrição do Serviço</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    O DigiRioh é um assistente de inteligência artificial que oferece serviços de automação e gerenciamento através do WhatsApp. O serviço inclui funcionalidades como gerenciamento de agenda, e-mails, contatos, criação de textos e outras tarefas administrativas.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">3. Registro e Conta</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground">3.1 Elegibilidade</h4>
                      <p className="text-muted-foreground">Você deve ter pelo menos 18 anos para usar este serviço. Ao criar uma conta, você declara que todas as informações fornecidas são verdadeiras e precisas.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">3.2 Responsabilidade da Conta</h4>
                      <p className="text-muted-foreground">Você é responsável por manter a confidencialidade de sua conta e por todas as atividades que ocorrem sob sua conta.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">4. Uso Aceitável</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Você concorda em não usar o serviço para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Qualquer propósito ilegal ou não autorizado</li>
                    <li>Transmitir vírus, malware ou código malicioso</li>
                    <li>Assediar, abusar ou prejudicar outras pessoas</li>
                    <li>Enviar spam ou conteúdo promocional não solicitado</li>
                    <li>Tentar acessar contas de outros usuários</li>
                    <li>Interferir com o funcionamento normal do serviço</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">5. Integração com Serviços de Terceiros</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground">5.1 Autorização</h4>
                      <p className="text-muted-foreground">O DigiRioh requer autorização para acessar seus serviços Google (Gmail, Calendar, Contacts) para fornecer funcionalidades específicas.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">5.2 Uso Limitado</h4>
                      <p className="text-muted-foreground">Nosso acesso aos seus dados é limitado às funcionalidades específicas solicitadas e está em conformidade com as políticas de uso limitado do Google.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">6. Planos e Pagamentos</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground">6.1 Planos Disponíveis</h4>
                      <p className="text-muted-foreground">Oferecemos planos gratuitos e pagos com diferentes níveis de funcionalidade.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">6.2 Cobrança</h4>
                      <p className="text-muted-foreground">Os planos pagos são cobrados mensalmente. O cancelamento pode ser feito a qualquer momento, mas as taxas pagas não são reembolsáveis, exceto quando exigido por lei.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">7. Propriedade Intelectual</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    O serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva da Rioh Digital AI Solutions e seus licenciadores. O serviço é protegido por direitos autorais, marcas registradas e outras leis.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">8. Limitação de Responsabilidade</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Em nenhuma circunstância a Rioh Digital AI Solutions será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">9. Rescisão</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos de Serviço.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">10. Modificações dos Termos</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Reservamo-nos o direito, a nosso critério exclusivo, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso antes de quaisquer novos termos entrarem em vigor.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">11. Lei Aplicável</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Estes Termos serão interpretados e regidos de acordo com as leis do Brasil, sem consideração aos seus princípios de conflito de leis.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">12. Contato</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Se você tiver alguma dúvida sobre estes Termos de Serviço, entre em contato conosco pelo e-mail: <a href="mailto:riohdigital@gmail.com" className="text-primary hover:underline">riohdigital@gmail.com</a>.
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
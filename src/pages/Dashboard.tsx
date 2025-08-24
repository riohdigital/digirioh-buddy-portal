
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  getCurrentUser,
  getUserProfile,
  generateWhatsappCode,
  unlinkWhatsappCode,
} from "@/lib/supabase";
import {
  Check,
  Copy,
  MessageSquare,
  Loader2,
  XCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Profile } from "@/types/supabase";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [whatsappCode, setWhatsappCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data } = await getCurrentUser();
        if (!data.user) {
          setIsLoading(false);
          return;
        }
        
        setUser(data.user);
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Houve um problema ao carregar seus dados. Tente novamente.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [toast]);

  const handleGenerateWhatsappCode = async () => {
    setIsGeneratingCode(true);
    try {
      const { code } = await generateWhatsappCode();
      setWhatsappCode(code);
      toast({
        title: "Código gerado com sucesso",
        description: "Use o código para conectar seu WhatsApp.",
      });
    } catch (error) {
      console.error("Error generating WhatsApp code:", error);
      toast({
        title: "Erro ao gerar código",
        description: "Houve um problema ao gerar o código. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleUnlinkWhatsapp = async () => {
    try {
      await unlinkWhatsappCode();
      setProfile(prev => prev ? { ...prev, whatsapp_jid: null } : null);
      toast({
        title: "WhatsApp desconectado",
        description: "Seu número de WhatsApp foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Error unlinking WhatsApp:", error);
      toast({
        title: "Erro ao desconectar WhatsApp",
        description: "Houve um problema ao desconectar seu WhatsApp. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const copyCodeToClipboard = () => {
    if (whatsappCode) {
      navigator.clipboard.writeText(whatsappCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Código copiado",
        description: "O código foi copiado para sua área de transferência.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-digirioh-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Seu Painel DigiRioh</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Google Connection */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Conexão com Google</h2>
                  
                  {user?.email && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-10 w-10 bg-digirioh-100 rounded-full flex items-center justify-center">
                        <span className="text-digirioh-600 font-bold">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Conectado como:</p>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-green-50 text-green-800 rounded-lg p-3 flex items-start gap-2">
                    <Check className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">Autorização concedida</p>
                      <p className="text-sm">Acesso à Agenda e Gmail concedidos</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* WhatsApp Connection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Conexão com WhatsApp</h2>
              
              {profile?.whatsapp_jid ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 bg-whatsapp rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp conectado</p>
                      <p className="text-gray-600">
                        {/* Extract phone number or mask for privacy */}
                        Número: {profile.whatsapp_jid.split("@")[0].replace(/\d(?=\d{4})/g, "*")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleUnlinkWhatsapp}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Desconectar WhatsApp
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-amber-50 text-amber-800 rounded-lg p-4 mb-6 flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">WhatsApp não conectado</p>
                      <p className="text-sm">Conecte seu WhatsApp para usar o DigiRioh no seu celular.</p>
                    </div>
                  </div>
                  
                  {whatsappCode ? (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Envie o código abaixo para o número <strong>+55 (XX) XXXXX-XXXX</strong> no WhatsApp:
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={whatsappCode}
                          readOnly
                          className="text-lg font-mono text-center"
                        />
                        <Button size="sm" variant="outline" onClick={copyCodeToClipboard}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Este código expira em 15 minutos. Após enviar o código, o DigiRioh estará disponível para você.
                      </p>
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => setWhatsappCode(null)}
                      >
                        Gerar novo código
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerateWhatsappCode}
                      disabled={isGeneratingCode}
                      className="w-full"
                    >
                      {isGeneratingCode ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <MessageSquare className="h-4 w-4 mr-2" />
                      )}
                      {isGeneratingCode ? "Gerando código..." : "Conectar WhatsApp"}
                    </Button>
                  )}
                </div>
              )}
            </Card>
            
            {/* Plan Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Seu Plano</h2>
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  profile?.plan === 'pro' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <span className={`font-bold ${
                    profile?.plan === 'pro' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {profile?.plan === 'pro' ? 'P' : 'G'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Plano atual:</p>
                  <p className={`${profile?.plan === 'pro' ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
                    {profile?.plan === 'pro' ? 'Plano Pro' : 'Plano Gratuito'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                {profile?.plan === 'pro' ? (
                  <div className="bg-purple-50 text-purple-800 rounded-lg p-4">
                    <p className="font-medium">Benefícios Pro ativos:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4" /> Mensagens ilimitadas
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4" /> Acesso a todas as funcionalidades
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4" /> Prioridade nas respostas
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4" /> Suporte prioritário
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Button asChild className="w-full justify-between">
                    <a href="/plans">
                      <span>Upgrade para o Plano Pro</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </Card>
            
            {/* Admin Panel (if user is admin) */}
            {profile?.role === 'admin' && (
              <Card className="p-6 bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Painel de Administração</h2>
                <p className="text-gray-600 mb-4">
                  Você tem privilégios de administrador nesta conta.
                </p>
                <Button variant="outline">
                  Acessar Ferramentas Admin
                </Button>
              </Card>
            )}
          </div>
          
          {/* Help Section */}
          <div className="mt-12">
            <Card className="p-6 bg-digirioh-50">
              <h2 className="text-xl font-semibold mb-4">Precisa de ajuda?</h2>
              <p className="text-gray-600 mb-6">
                Se você tiver problemas com sua conta DigiRioh ou precisar de suporte, entre em contato conosco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">
                  Guia de Primeiros Passos
                </Button>
                <Button variant="outline">
                  Contatar Suporte
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-digirioh-900 text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-xl font-bold mb-4 md:mb-0">
              <MessageSquare className="h-5 w-5" />
              <span>DigiRioh</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-digirioh-300">
                &copy; {new Date().getFullYear()} DigiRioh. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

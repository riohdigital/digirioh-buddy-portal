
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-digirioh-50 px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <MessageSquare className="h-12 w-12 text-digirioh-500" />
          <span className="text-3xl font-bold text-digirioh-700">DigiRioh</span>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-digirioh-800">404</h1>
        <p className="text-xl text-gray-600 mb-8">Ops! Esta página não foi encontrada.</p>
        
        <Button asChild className="px-8 py-6 text-lg bg-digirioh-600 hover:bg-digirioh-700">
          <a href="/">Voltar para a Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

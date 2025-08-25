
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import digiriohLogo from "@/assets/digirioh-logo.png";
import digiriohLogoText from "@/assets/digirioh-logo-text.png";

export function Navbar() {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ${
      isScrolled ? "glass-effect shadow-lg" : "bg-transparent"
    }`}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={digiriohLogoText} alt="DigiRioh" className="h-10 hidden sm:block" />
        </Link>
        
        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/features" className="text-foreground hover:text-primary transition-colors font-medium hidden sm:block">
                Funcionalidades
              </Link>
              <Link to="/plans" className="text-foreground hover:text-primary transition-colors font-medium hidden sm:block">
                Planos
              </Link>
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                Entrar
              </Button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium hidden sm:block">
                Dashboard
              </Link>
              <Link to="/plans" className="text-foreground hover:text-primary transition-colors font-medium hidden sm:block">
                Planos
              </Link>
              <Button variant="outline" onClick={handleSignOut} size="sm">
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

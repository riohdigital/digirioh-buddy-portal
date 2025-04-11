
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut } from "@/lib/supabase";
import { MessageSquare } from "lucide-react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await getCurrentUser();
      setIsLoggedIn(!!data.user);
    };
    
    checkAuth();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all ${
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-digirioh-700">
          <MessageSquare className="h-8 w-8 text-digirioh-500" />
          <span>DigiRioh</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link to="/features" className="text-digirioh-700 hover:text-digirioh-500">
                Funcionalidades
              </Link>
              <Link to="/plans" className="text-digirioh-700 hover:text-digirioh-500">
                Planos
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-digirioh-700 hover:text-digirioh-500">
                Dashboard
              </Link>
              <Link to="/plans" className="text-digirioh-700 hover:text-digirioh-500">
                Planos
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

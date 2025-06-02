
import { SportsChat } from '@/components/SportsChat';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function SportsChatPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto py-8">
        <SportsChat />
      </div>
    </div>
  );
}

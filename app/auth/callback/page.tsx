'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      toast.error('Erreur d\'authentification');
      router.push('/login');
      return;
    }

    // Récupérer les infos utilisateur avec le token
    const fetchUser = async () => {
      try {
        // Stocker temporairement le token
        localStorage.setItem('token', token);
        
        // Récupérer les infos utilisateur
        const response = await api.get('/auth/me');
        const user = response.data;

        setAuth(user, token);
        toast.success(`Bienvenue ${user.prenom} !`);
        router.push('/dashboard');
      } catch (error) {
        toast.error('Erreur lors de la récupération du profil');
        router.push('/login');
      }
    };

    fetchUser();
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Connexion en cours...</p>
      </div>
    </div>
  );
}
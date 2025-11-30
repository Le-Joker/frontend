'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Shield, AlertTriangle } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Vérification 1 : Utilisateur connecté
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin');
      return;
    }

    // Vérification 2 : Rôle ADMIN
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Si pas connecté ou pas admin, afficher un écran de chargement/erreur
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette zone.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Afficher un écran de vérification pendant le chargement
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Si tout est OK, afficher le contenu admin
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bandeau de sécurité */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4" />
            <span className="font-semibold">Zone Admin Sécurisée</span>
          </div>
          <div className="text-xs opacity-90">
            Connecté en tant que : {user.email}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
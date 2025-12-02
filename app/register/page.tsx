'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, User, Phone, Chrome, GraduationCap, Users, FileText, Shield } from 'lucide-react';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

type Role = 'ADMIN' | 'FORMATEUR' | 'ETUDIANT' | 'CLIENT';

const roles = [
  {
    value: 'FORMATEUR' as Role,
    label: 'Formateur',
    description: 'Créer et gérer des formations BTP',
    icon: GraduationCap,
    color: 'blue',
  },
  {
    value: 'ETUDIANT' as Role,
    label: 'Étudiant',
    description: 'Suivre des formations',
    icon: Users,
    color: 'purple',
  },
  {
    value: 'CLIENT' as Role,
    label: 'Client',
    description: 'Demander des devis',
    icon: FileText,
    color: 'green',
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: 'ETUDIANT' as Role,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const response = await api.post('/auth/register', {
      email: formData.email,
      motDePasse: formData.password, // ✅ motDePasse
      prenom: formData.prenom,       // ✅ prenom
      nom: formData.nom,             // ✅ nom
      telephone: formData.telephone, // ✅ telephone
      role: formData.role,
    });

    const { user, token } = response.data;
    
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setToken(token);

    if (user.role === 'formateur' && !user.testFormateurValide) {
      router.push('/test-formateur');
    } else {
      router.push('/dashboard');
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
  }
};

  const handleGoogleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {/* Header - Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">INTELLECT BUILDING</span>
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">Créer un compte</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">Rejoignez la plateforme BTP nouvelle génération</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Bouton Google OAuth - Responsive */}
          <button
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all font-medium text-sm sm:text-base text-gray-700"
          >
            <Chrome className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="hidden sm:inline">S'inscrire avec Google</span>
            <span className="sm:hidden">Google</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white text-gray-500">Ou avec un email</span>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Choix du rôle - Responsive Grid */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Je suis un(e) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = formData.role === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl transition-all text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-1.5 sm:mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="font-semibold text-sm sm:text-base text-gray-900">{role.label}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">{role.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nom et Prénom - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Nom *
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Prénom *
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Marie"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Téléphone (optionnel)
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="0612345678"
                />
              </div>
            </div>

            {/* Mot de passe - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Confirmer *
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Note formateur - Responsive */}
            {formData.role === 'FORMATEUR' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex gap-2 sm:gap-3">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-blue-800">
                  <strong>Note :</strong> Vous devrez passer un test de compétences.
                </div>
              </div>
            )}

            {/* CGU - Responsive */}
            <div className="text-xs sm:text-sm text-gray-600">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/cgu" className="text-blue-600 hover:text-blue-700 font-medium">
                CGU
              </Link>{' '}
              et notre{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                Politique de Confidentialité
              </Link>
              .
            </div>

            {/* Submit - Responsive */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Lien connexion - Responsive */}
          <div className="text-center text-xs sm:text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Se connecter
            </Link>
          </div>
        </div>

        {/* Retour accueil */}
        <div className="text-center mt-4 sm:mt-6">
          <Link href="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
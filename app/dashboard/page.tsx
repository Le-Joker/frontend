'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { Award, BookOpen, TrendingUp, Users, FileText, Building, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  // Dashboard Étudiant
  if (user.role === 'ETUDIANT') {
    return (
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header - Responsive */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Bienvenue, {user.prenom} !</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Voici un aperçu de votre progression</p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Formations en cours</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Terminées</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">7</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Certificats</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formations en cours */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Mes formations en cours</h2>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Maçonnerie niveau {i}</h3>
                  <span className="text-xs sm:text-sm text-blue-600 font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">3 modules sur 8 terminés</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Formateur
  if (user.role === 'FORMATEUR') {
    return (
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Bienvenue, {user.prenom} !</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Gérez vos formations et vos étudiants</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Formations</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Étudiants</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Taux réussite</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">87%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Certifications</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">89</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Actions rapides</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/dashboard/formations/create"
              className="p-4 sm:p-5 md:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-center"
            >
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Créer une formation</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Ajouter un nouveau cours</p>
            </Link>
            <Link
              href="/dashboard/students"
              className="p-4 sm:p-5 md:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all text-center"
            >
              <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Voir mes étudiants</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Gérer les inscriptions</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Client
  if (user.role === 'CLIENT') {
    return (
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Bienvenue, {user.prenom} !</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Suivez vos projets et demandes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Devis en attente</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Chantiers en cours</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Terminés</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Actions rapides</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/dashboard/devis/new"
              className="p-4 sm:p-5 md:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-center"
            >
              <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Demander un devis</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Nouveau projet BTP</p>
            </Link>
            <Link
              href="/dashboard/chantiers"
              className="p-4 sm:p-5 md:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all text-center"
            >
              <Building className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Mes chantiers</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Suivre l'avancement</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Admin
  if (user.role === 'ADMIN') {
    return (
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Tableau de bord Admin</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble de la plateforme</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Utilisateurs</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Formations</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">89</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Chantiers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Croissance</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">+23%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Actions rapides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link
              href="/admin/users"
              className="p-4 sm:p-5 md:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-center"
            >
              <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Gérer utilisateurs</p>
            </Link>
            <Link
              href="/admin/stats"
              className="p-4 sm:p-5 md:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all text-center"
            >
              <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Voir statistiques</p>
            </Link>
            <Link
              href="/admin/testimonials"
              className="p-4 sm:p-5 md:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all text-center"
            >
              <Award className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Modérer témoignages</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
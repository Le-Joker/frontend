// app/dashboard/page.tsx - VERSION DYNAMIQUE POUR FORMATEUR
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  Users, 
  FileText, 
  Building, 
  CheckCircle, 
  Clock,
  Star,
  Eye,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface FormateurStats {
  totalFormations: number;
  totalEtudiants: number;
  totalInscriptions: number;
  inscriptionsActives: number;
  inscriptionsTerminees: number;
  progressionMoyenne: number;
  tauxCompletion: number;
  formationsPopulaires: Array<{
    id: string;
    titre: string;
    nombreInscrits: number;
  }>;
}

interface RecentInscription {
  id: string;
  progression: number;
  statut: string;
  dateInscription: string;
  etudiant: {
    prenom: string;
    nom: string;
  };
  formation: {
    titre: string;
  };
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<FormateurStats | null>(null);
  const [recentInscriptions, setRecentInscriptions] = useState<RecentInscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'FORMATEUR') {
      fetchFormateurData();
    }
  }, [user]);

  const fetchFormateurData = async () => {
    try {
      const [statsRes, inscriptionsRes] = await Promise.all([
        api.get('/inscriptions/formateur/stats'),
        api.get('/inscriptions/formateur'),
      ]);

      setStats(statsRes.data);
      setRecentInscriptions(inscriptionsRes.data.slice(0, 5)); // 5 dernières
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Dashboard Formateur DYNAMIQUE
  if (user.role === 'FORMATEUR') {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenue, {user.prenom} ! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Voici un aperçu de votre activité de formation
          </p>
        </div>

        {/* Stats Cards - DONNÉES RÉELLES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Formations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalFormations || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Étudiants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalEtudiants || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progression</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.progressionMoyenne || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Taux réussite</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.tauxCompletion || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique de progression */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inscriptions actives vs terminées */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              État des inscriptions
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">En cours</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {stats?.inscriptionsActives || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${
                        stats?.totalInscriptions
                          ? (stats.inscriptionsActives / stats.totalInscriptions) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Terminées</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats?.inscriptionsTerminees || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${
                        stats?.totalInscriptions
                          ? (stats.inscriptionsTerminees / stats.totalInscriptions) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total inscriptions : <strong>{stats?.totalInscriptions || 0}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Formations populaires */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Formations les plus populaires
            </h2>
            <div className="space-y-3">
              {stats?.formationsPopulaires && stats.formationsPopulaires.length > 0 ? (
                stats.formationsPopulaires.map((formation, index) => (
                  <div
                    key={formation.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {formation.titre}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formation.nombreInscrits} inscrit(s)
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/formations/${formation.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                  Aucune formation pour le moment
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Activité récente
          </h2>
          {recentInscriptions.length > 0 ? (
            <div className="space-y-3">
              {recentInscriptions.map((inscription) => (
                <div
                  key={inscription.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {inscription.etudiant.prenom[0]}{inscription.etudiant.nom[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {inscription.etudiant.prenom} {inscription.etudiant.nom}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {inscription.formation.titre}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {inscription.progression}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(inscription.dateInscription).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${inscription.progression}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
              Aucune activité récente
            </p>
          )}
        </div>

        {/* Actions rapides */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/formations/create"
              className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-center group"
            >
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 dark:text-white">Créer une formation</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Nouveau cours</p>
            </Link>
            <Link
              href="/dashboard/students"
              className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all text-center group"
            >
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 dark:text-white">Mes étudiants</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gérer les inscriptions</p>
            </Link>
            <Link
              href="/dashboard/formations"
              className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all text-center group"
            >
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 dark:text-white">Mes formations</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Voir toutes</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Étudiant (inchangé pour l'instant)
  if (user.role === 'ETUDIANT') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenue, {user.prenom} !</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Voici un aperçu de votre progression</p>
        </div>
        {/* ... reste du code étudiant ... */}
      </div>
    );
  }

  // Dashboard Client (inchangé)
  if (user.role === 'CLIENT') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenue, {user.prenom} !</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Suivez vos projets et demandes</p>
        </div>
        {/* ... reste du code client ... */}
      </div>
    );
  }

  // Dashboard Admin (inchangé)
  if (user.role === 'ADMIN') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord Admin</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble de la plateforme</p>
        </div>
        {/* ... reste du code admin ... */}
      </div>
    );
  }

  return null;
}
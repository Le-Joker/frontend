'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Clock, 
  CheckCircle, 
  Pause,
  MapPin,
  TrendingUp,
  Calendar,
  Eye
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Chantier {
  id: string;
  titre: string;
  description: string;
  adresse: string;
  dateDebut: string;
  dateFin: string | null;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'EN_PAUSE' | 'TERMINE' | 'ANNULE';
  progression: number;
  budget: number | null;
}

export default function ChantiersPage() {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchChantiers = async () => {
      try {
        // Simuler des données
        setChantiers([
          {
            id: '1',
            titre: 'Rénovation appartement',
            description: 'Rénovation complète d\'un appartement de 80m²',
            adresse: '15 rue de la République, Paris 75011',
            dateDebut: '2025-01-15',
            dateFin: '2025-03-15',
            statut: 'EN_COURS',
            progression: 45,
            budget: 35000,
          },
          {
            id: '2',
            titre: 'Construction garage',
            description: 'Construction d\'un garage double 40m²',
            adresse: '8 avenue du Général, Lyon 69003',
            dateDebut: '2024-12-01',
            dateFin: '2025-02-28',
            statut: 'EN_COURS',
            progression: 75,
            budget: 28000,
          },
          {
            id: '3',
            titre: 'Aménagement extérieur',
            description: 'Terrasse et clôture jardin',
            adresse: '42 chemin des Vignes, Marseille 13008',
            dateDebut: '2024-11-01',
            dateFin: '2024-12-20',
            statut: 'TERMINE',
            progression: 100,
            budget: 15000,
          },
        ]);
      } catch (error) {
        toast.error('Erreur lors du chargement des chantiers');
      } finally {
        setLoading(false);
      }
    };

    fetchChantiers();
  }, []);

  const getStatutBadge = (statut: string) => {
    const badges = {
      EN_ATTENTE: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', icon: Clock, label: 'En attente' },
      EN_COURS: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: TrendingUp, label: 'En cours' },
      EN_PAUSE: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300', icon: Pause, label: 'En pause' },
      TERMINE: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle, label: 'Terminé' },
      ANNULE: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: Clock, label: 'Annulé' },
    };
    return badges[statut as keyof typeof badges] || badges.EN_ATTENTE;
  };

  const filteredChantiers = filter === 'all' ? chantiers : chantiers.filter(c => c.statut === filter);

  const stats = {
    total: chantiers.length,
    enCours: chantiers.filter(c => c.statut === 'EN_COURS').length,
    termine: chantiers.filter(c => c.statut === 'TERMINE').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header - Responsive */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Mes chantiers</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Suivez l'avancement de vos projets
        </p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">En cours</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.enCours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Terminés</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.termine}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres - Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('EN_COURS')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
              filter === 'EN_COURS'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter('TERMINE')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
              filter === 'TERMINE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Terminés
          </button>
        </div>
      </div>

      {/* Liste chantiers - Responsive */}
      {filteredChantiers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-10 md:p-12 text-center">
          <Building className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun chantier
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Vos chantiers apparaîtront ici après acceptation des devis
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {filteredChantiers.map((chantier) => {
            const StatutBadge = getStatutBadge(chantier.statut);
            const StatutIcon = StatutBadge.icon;
            
            return (
              <div
                key={chantier.id}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                        {chantier.titre}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${StatutBadge.color} flex-shrink-0`}>
                        <StatutIcon className="h-3 w-3" />
                        <span className="hidden sm:inline">{StatutBadge.label}</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {chantier.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">{chantier.adresse}</span>
                    </div>
                  </div>
                </div>

                {/* Progression - Responsive */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
                    <span className="text-xs sm:text-sm font-bold text-blue-600">{chantier.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
                    <div 
                      className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${chantier.progression}%` }}
                    />
                  </div>
                </div>

                {/* Infos - Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date début</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date(chantier.dateDebut).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date fin prévue</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      {chantier.dateFin ? new Date(chantier.dateFin).toLocaleDateString('fr-FR') : 'Non définie'}
                    </p>
                  </div>
                  {chantier.budget && (
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {chantier.budget.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  )}
                </div>

                {/* Action */}
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  Voir détails
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
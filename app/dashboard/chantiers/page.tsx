// app/dashboard/chantiers/page.tsx - VERSION FINALE
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
  Eye,
  Euro
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
  image?: string;
}

interface Statistics {
  total: number;
  enCours: number;
  termine: number;
  enPause: number;
}

export default function ChantiersPage() {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    enCours: 0,
    termine: 0,
    enPause: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchChantiers();
    fetchStatistics();
  }, []);

  const fetchChantiers = async () => {
    try {
      const response = await api.get('/chantiers');
      setChantiers(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des chantiers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/chantiers/stats');
      setStatistics(response.data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes chantiers</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Suivez l'avancement de vos projets
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.enCours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Terminés</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.termine}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Pause className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En pause</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.enPause}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Tous ({statistics.total})
          </button>
          <button
            onClick={() => setFilter('EN_COURS')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              filter === 'EN_COURS'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            En cours ({statistics.enCours})
          </button>
          <button
            onClick={() => setFilter('TERMINE')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              filter === 'TERMINE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Terminés ({statistics.termine})
          </button>
        </div>
      </div>

      {/* Liste chantiers */}
      {filteredChantiers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun chantier
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Vos chantiers apparaîtront ici après acceptation des devis
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredChantiers.map((chantier) => {
            const StatutBadge = getStatutBadge(chantier.statut);
            const StatutIcon = StatutBadge.icon;
            
            return (
              <div
                key={chantier.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {chantier.titre}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${StatutBadge.color}`}>
                        <StatutIcon className="h-3 w-3" />
                        {StatutBadge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {chantier.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {chantier.adresse}
                    </div>
                  </div>
                </div>

                {/* Progression */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
                    <span className="text-sm font-bold text-blue-600">{chantier.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${chantier.progression}%` }}
                    />
                  </div>
                </div>

                {/* Infos */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date début</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date(chantier.dateDebut).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date fin prévue</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {chantier.dateFin ? new Date(chantier.dateFin).toLocaleDateString('fr-FR') : 'Non définie'}
                    </p>
                  </div>
                  {chantier.budget && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        {chantier.budget.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  )}
                </div>

                {/* Action */}
                <Link
                  href={`/dashboard/chantiers/${chantier.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  Voir détails
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
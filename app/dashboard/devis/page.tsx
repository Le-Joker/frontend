'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Calendar,
  Euro
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Devis {
  id: string;
  reference: string;
  titre: string;
  description: string;
  type: string;
  montant: number | null;
  statut: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE' | 'ANNULE';
  adresseChantier: string;
  dateDebut: string | null;
  createdAt: string;
}

export default function DevisPage() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        // Simuler des données pour l'instant
        setDevis([
          {
            id: '1',
            reference: 'DEV-2025-001',
            titre: 'Rénovation cuisine',
            description: 'Rénovation complète de la cuisine',
            type: 'RENOVATION',
            montant: 15000,
            statut: 'EN_ATTENTE',
            adresseChantier: '123 rue de la Paix, Paris',
            dateDebut: '2025-02-01',
            createdAt: '2025-01-15',
          },
          {
            id: '2',
            reference: 'DEV-2025-002',
            titre: 'Extension garage',
            description: 'Construction extension 20m²',
            type: 'CONSTRUCTION',
            montant: 25000,
            statut: 'ACCEPTE',
            adresseChantier: '45 avenue Victor Hugo, Lyon',
            dateDebut: '2025-03-01',
            createdAt: '2025-01-10',
          },
          {
            id: '3',
            reference: 'DEV-2025-003',
            titre: 'Aménagement combles',
            description: 'Aménagement de combles perdus',
            type: 'AMENAGEMENT',
            montant: null,
            statut: 'EN_ATTENTE',
            adresseChantier: '78 rue des Lilas, Marseille',
            dateDebut: null,
            createdAt: '2025-01-20',
          },
        ]);
      } catch (error) {
        toast.error('Erreur lors du chargement des devis');
      } finally {
        setLoading(false);
      }
    };

    fetchDevis();
  }, []);

  const getStatutBadge = (statut: string) => {
    const badges = {
      EN_ATTENTE: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', icon: Clock, label: 'En attente' },
      ACCEPTE: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle, label: 'Accepté' },
      REFUSE: { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: XCircle, label: 'Refusé' },
      ANNULE: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: XCircle, label: 'Annulé' },
    };
    return badges[statut as keyof typeof badges] || badges.EN_ATTENTE;
  };

  const filteredDevis = filter === 'all' ? devis : devis.filter(d => d.statut === filter);

  const stats = {
    total: devis.length,
    enAttente: devis.filter(d => d.statut === 'EN_ATTENTE').length,
    accepte: devis.filter(d => d.statut === 'ACCEPTE').length,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Mes devis</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos demandes de devis
          </p>
        </div>
        <Link
          href="/dashboard/devis/new"
          className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Nouvelle demande</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">En attente</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.enAttente}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Acceptés</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.accepte}</p>
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
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setFilter('EN_ATTENTE')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
              filter === 'EN_ATTENTE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('ACCEPTE')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
              filter === 'ACCEPTE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Acceptés
          </button>
        </div>
      </div>

      {/* Liste devis - Responsive */}
      {filteredDevis.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-10 md:p-12 text-center">
          <FileText className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun devis
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            Créez votre première demande de devis
          </p>
          <Link
            href="/dashboard/devis/new"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Nouvelle demande
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {filteredDevis.map((devis) => {
            const StatutBadge = getStatutBadge(devis.statut);
            const StatutIcon = StatutBadge.icon;
            
            return (
              <div
                key={devis.id}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {devis.reference}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                      {devis.titre}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${StatutBadge.color} flex-shrink-0 ml-2`}>
                    <StatutIcon className="h-3 w-3" />
                    <span className="hidden sm:inline">{StatutBadge.label}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                  {devis.description}
                </p>

                {/* Infos */}
                <div className="space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">
                      {devis.dateDebut ? new Date(devis.dateDebut).toLocaleDateString('fr-FR') : 'Date non définie'}
                    </span>
                  </div>
                  {devis.montant && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      <Euro className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{devis.montant.toLocaleString('fr-FR')} €</span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <button className="w-full inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium">
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
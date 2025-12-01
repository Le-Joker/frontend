// app/dashboard/devis/page.tsx - VERSION FINALE
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
  Euro,
  Trash2
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

interface Statistics {
  total: number;
  enAttente: number;
  accepte: number;
  refuse: number;
}

export default function DevisPage() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    enAttente: 0,
    accepte: 0,
    refuse: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchDevis();
    fetchStatistics();
  }, []);

  const fetchDevis = async () => {
    try {
      const response = await api.get('/devis');
      setDevis(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des devis');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/devis/stats');
      setStatistics(response.data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer le devis "${titre}" ?`)) return;

    try {
      await api.delete(`/devis/${id}`);
      setDevis(devis.filter(d => d.id !== id));
      toast.success('Devis supprimé');
      fetchStatistics();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes devis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos demandes de devis
          </p>
        </div>
        <Link
          href="/dashboard/devis/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Nouvelle demande
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.enAttente}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acceptés</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.accepte}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Refusés</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.refuse}</p>
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
            onClick={() => setFilter('EN_ATTENTE')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              filter === 'EN_ATTENTE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            En attente ({statistics.enAttente})
          </button>
          <button
            onClick={() => setFilter('ACCEPTE')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              filter === 'ACCEPTE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Acceptés ({statistics.accepte})
          </button>
        </div>
      </div>

      {/* Liste devis */}
      {filteredDevis.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun devis
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Créez votre première demande de devis
          </p>
          <Link
            href="/dashboard/devis/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Nouvelle demande
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevis.map((devis) => {
            const StatutBadge = getStatutBadge(devis.statut);
            const StatutIcon = StatutBadge.icon;
            
            return (
              <div
                key={devis.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {devis.reference}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {devis.titre}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${StatutBadge.color}`}>
                    <StatutIcon className="h-3 w-3" />
                    {StatutBadge.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {devis.description}
                </p>

                {/* Infos */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {devis.dateDebut ? new Date(devis.dateDebut).toLocaleDateString('fr-FR') : 'Date non définie'}
                  </div>
                  {devis.montant && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <Euro className="h-4 w-4" />
                      {devis.montant.toLocaleString('fr-FR')} €
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/devis/${devis.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    Détails
                  </Link>
                  <button
                    onClick={() => handleDelete(devis.id, devis.titre)}
                    className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
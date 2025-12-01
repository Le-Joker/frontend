'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

interface Formation {
  id: string;
  titre: string;
  description: string;
  image?: string;
  duree: number;
  niveau: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  status: 'BROUILLON' | 'PUBLIEE' | 'ARCHIVEE';
  nombreInscrits: number;
  noteAverage: number;
  nombreAvis: number;
  createdAt: string;
}

interface Statistics {
  total: number;
  publiques: number;
  brouillons: number;
}

export default function FormationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({ total: 0, publiques: 0, brouillons: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'BROUILLON' | 'PUBLIEE'>('all');

  useEffect(() => {
    if (user?.role !== 'FORMATEUR') {
      toast.error('Accès réservé aux formateurs');
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const [formationsRes, statsRes] = await Promise.all([
          api.get('/formations/my-formations'),
          api.get('/formations/stats'),
        ]);
        
        setFormations(formationsRes.data);
        setStatistics(statsRes.data);
      } catch (error) {
        toast.error('Erreur lors du chargement des formations');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'FORMATEUR') {
      fetchFormations();
    }
  }, [user]);

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer la formation "${titre}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
      await api.delete(`/formations/${id}`);
      setFormations(formations.filter(f => f.id !== id));
      toast.success('Formation supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.post(`/formations/${id}/publish`);
      setFormations(formations.map(f => 
        f.id === id ? { ...f, status: 'PUBLIEE' as const } : f
      ));
      toast.success('Formation publiée avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la publication');
    }
  };

  const getNiveauBadge = (niveau: string) => {
    const badges = {
      DEBUTANT: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      INTERMEDIAIRE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      AVANCE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    };
    return badges[niveau as keyof typeof badges] || badges.DEBUTANT;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      BROUILLON: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: AlertCircle },
      PUBLIEE: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle },
      ARCHIVEE: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300', icon: AlertCircle },
    };
    return badges[status as keyof typeof badges] || badges.BROUILLON;
  };

  const filteredFormations = filter === 'all' 
    ? formations 
    : formations.filter(f => f.status === filter);

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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Mes formations</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos formations et créez du contenu
          </p>
        </div>
        <Link
          href="/dashboard/formations/create"
          className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Créer une formation</span>
          <span className="sm:hidden">Créer</span>
        </Link>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Publiées</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{statistics.publiques}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Brouillons</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{statistics.brouillons}</p>
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
            Toutes ({formations.length})
          </button>
          <button
            onClick={() => setFilter('PUBLIEE')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
              filter === 'PUBLIEE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Publiées ({formations.filter(f => f.status === 'PUBLIEE').length})
          </button>
          <button
            onClick={() => setFilter('BROUILLON')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
              filter === 'BROUILLON'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Brouillons ({formations.filter(f => f.status === 'BROUILLON').length})
          </button>
        </div>
      </div>

      {/* Liste formations - Responsive Grid */}
      {filteredFormations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-10 md:p-12 text-center">
          <BookOpen className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucune formation
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            Créez votre première formation pour commencer à enseigner
          </p>
          <Link
            href="/dashboard/formations/create"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Créer ma première formation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {filteredFormations.map((formation) => {
            const StatusIcon = getStatusBadge(formation.status).icon;
            return (
              <div
                key={formation.id}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image - Responsive Height */}
                <div className="h-36 sm:h-40 md:h-44 lg:h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                  {formation.image ? (
                    <img
                      src={formation.image}
                      alt={formation.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadge(formation.status).color}`}>
                      <StatusIcon className="h-3 w-3" />
                      <span className="hidden sm:inline">{formation.status}</span>
                    </span>
                  </div>
                </div>

                {/* Contenu - Responsive Padding */}
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium ${getNiveauBadge(formation.niveau)}`}>
                      {formation.niveau}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formation.duree}h
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {formation.titre}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                    {formation.description}
                  </p>

                  {/* Stats - Responsive */}
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{formation.nombreInscrits}</span>
                    </div>
                    {formation.nombreAvis > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span>{formation.noteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions - Responsive */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/formations/${formation.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Gérer</span>
                    </Link>
                    
                    {formation.status === 'BROUILLON' && (
                      <button
                        onClick={() => handlePublish(formation.id)}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-xs sm:text-sm font-medium"
                        title="Publier"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(formation.id, formation.titre)}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-xs sm:text-sm font-medium"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
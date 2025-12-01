'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Search,
  Filter,
  TrendingUp,
  Award
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Formation {
  id: string;
  titre: string;
  description: string;
  image?: string;
  duree: number;
  niveau: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  nombreInscrits: number;
  noteAverage: number;
  nombreAvis: number;
  formateur: {
    prenom: string;
    nom: string;
  };
}

export default function CataloguePage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [niveauFilter, setNiveauFilter] = useState<string>('all');

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      // Récupérer uniquement les formations publiées
      const response = await api.get('/formations?status=PUBLIEE');
      setFormations(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement du catalogue');
    } finally {
      setLoading(false);
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

  const filteredFormations = formations.filter((formation) => {
    const matchSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       formation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNiveau = niveauFilter === 'all' || formation.niveau === niveauFilter;
    return matchSearch && matchNiveau;
  });

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Catalogue de formations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Découvrez et inscrivez-vous aux formations disponibles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Formations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inscrits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formations.reduce((acc, f) => acc + f.nombreInscrits, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Heures total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formations.reduce((acc, f) => acc + f.duree, 0)}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formations.length > 0 
                  ? (formations.reduce((acc, f) => acc + f.noteAverage, 0) / formations.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Filtres niveau */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setNiveauFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                niveauFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Tous les niveaux
            </button>
            <button
              onClick={() => setNiveauFilter('DEBUTANT')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                niveauFilter === 'DEBUTANT'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Débutant
            </button>
            <button
              onClick={() => setNiveauFilter('INTERMEDIAIRE')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                niveauFilter === 'INTERMEDIAIRE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Intermédiaire
            </button>
            <button
              onClick={() => setNiveauFilter('AVANCE')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                niveauFilter === 'AVANCE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Avancé
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredFormations.length} formation(s) trouvée(s)
        </p>
      </div>

      {/* Grille de formations */}
      {filteredFormations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucune formation trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Modifiez vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormations.map((formation) => (
            <div
              key={formation.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                {formation.image ? (
                  <img
                    src={formation.image}
                    alt={formation.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-16 w-16 text-white/50" />
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getNiveauBadge(formation.niveau)}`}>
                    {formation.niveau}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formation.duree}h
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {formation.titre}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {formation.description}
                </p>

                {/* Formateur */}
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  Par {formation.formateur.prenom} {formation.formateur.nom}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{formation.nombreInscrits}</span>
                  </div>
                  {formation.nombreAvis > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{formation.noteAverage.toFixed(1)}</span>
                      <span className="text-xs">({formation.nombreAvis})</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/dashboard/formations/${formation.id}/view`}
                  className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Voir la formation
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
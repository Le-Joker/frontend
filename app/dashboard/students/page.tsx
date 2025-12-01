// app/dashboard/students/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  BookOpen, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Award,
  Eye,
  Filter
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Inscription {
  id: string;
  progression: number;
  statut: 'EN_COURS' | 'TERMINEE' | 'ABANDONNEE';
  dateInscription: string;
  dateCompletion: string | null;
  tempsTotal: number;
  etudiant: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
  formation: {
    id: string;
    titre: string;
    niveau: string;
  };
}

interface Statistics {
  totalEtudiants: number;
  totalInscriptions: number;
  inscriptionsActives: number;
  inscriptionsTerminees: number;
  progressionMoyenne: number;
  tauxCompletion: number;
}

export default function StudentsPage() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalEtudiants: 0,
    totalInscriptions: 0,
    inscriptionsActives: 0,
    inscriptionsTerminees: 0,
    progressionMoyenne: 0,
    tauxCompletion: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('all');

  useEffect(() => {
    fetchInscriptions();
    fetchStatistics();
  }, []);

  const fetchInscriptions = async () => {
    try {
      const response = await api.get('/inscriptions/formateur');
      setInscriptions(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/inscriptions/formateur/stats');
      setStatistics(response.data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      EN_COURS: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: Clock, label: 'En cours' },
      TERMINEE: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle, label: 'Terminée' },
      ABANDONNEE: { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: Clock, label: 'Abandonnée' },
    };
    return badges[statut as keyof typeof badges] || badges.EN_COURS;
  };

  const filteredInscriptions = inscriptions.filter((inscription) => {
    const matchSearch = 
      inscription.etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.etudiant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.formation.titre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatut = filterStatut === 'all' || inscription.statut === filterStatut;
    
    return matchSearch && matchStatut;
  });

  // Grouper par étudiant
  const etudiantsMap = new Map<string, {
    etudiant: Inscription['etudiant'];
    inscriptions: Inscription[];
  }>();

  filteredInscriptions.forEach((inscription) => {
    const key = inscription.etudiant.id;
    if (!etudiantsMap.has(key)) {
      etudiantsMap.set(key, {
        etudiant: inscription.etudiant,
        inscriptions: [],
      });
    }
    etudiantsMap.get(key)!.inscriptions.push(inscription);
  });

  const etudiants = Array.from(etudiantsMap.values());

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes étudiants</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Suivez la progression de vos apprenants
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Étudiants</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.totalEtudiants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Inscriptions</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.totalInscriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Actives</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.inscriptionsActives}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Terminées</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.inscriptionsTerminees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Progression</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.progressionMoyenne}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Complétion</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.tauxCompletion}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un étudiant ou une formation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Filtres statut */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatut('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatut === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterStatut('EN_COURS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatut === 'EN_COURS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilterStatut('TERMINEE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatut === 'TERMINEE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Terminées
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {etudiants.length} étudiant(s) trouvé(s)
        </p>
      </div>

      {/* Liste étudiants */}
      {etudiants.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun étudiant trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Vos étudiants inscrits apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {etudiants.map(({ etudiant, inscriptions }) => {
            const progressionMoyenne = Math.round(
              inscriptions.reduce((acc, i) => acc + i.progression, 0) / inscriptions.length
            );
            const formationsActives = inscriptions.filter(i => i.statut === 'EN_COURS').length;
            const formationsTerminees = inscriptions.filter(i => i.statut === 'TERMINEE').length;

            return (
              <div
                key={etudiant.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {etudiant.prenom[0]}{etudiant.nom[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {etudiant.prenom} {etudiant.nom}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{etudiant.email}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{inscriptions.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Formations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formationsTerminees}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Terminées</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{progressionMoyenne}%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Moyenne</p>
                  </div>
                </div>

                {/* Inscriptions */}
                <div className="space-y-2 mb-4">
                  {inscriptions.slice(0, 2).map((inscription) => {
                    const StatutBadge = getStatutBadge(inscription.statut);
                    const StatutIcon = StatutBadge.icon;
                    
                    return (
                      <div key={inscription.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                            {inscription.formation.titre}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${StatutBadge.color}`}>
                            <StatutIcon className="h-3 w-3" />
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${inscription.progression}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {inscriptions.length > 2 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{inscriptions.length - 2} autre(s) formation(s)
                    </p>
                  )}
                </div>

                {/* Action */}
                <Link
                  href={`/dashboard/students/${etudiant.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Eye className="h-4 w-4 inline mr-2" />
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
// app/dashboard/students/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
  Eye,
  MessageSquare
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Etudiant {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  createdAt: string;
}

interface Inscription {
  id: string;
  progression: number;
  statut: 'EN_COURS' | 'TERMINEE' | 'ABANDONNEE';
  dateInscription: string;
  dateCompletion: string | null;
  tempsTotal: number;
  note: number | null;
  formation: {
    id: string;
    titre: string;
    niveau: string;
    duree: number;
  };
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const etudiantId = params.id as string;

  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [etudiantId]);

  const fetchStudentData = async () => {
    try {
      // Récupérer toutes les inscriptions du formateur
      const response = await api.get('/inscriptions/formateur');
      
      // Filtrer les inscriptions de cet étudiant
      const studentInscriptions = response.data.filter(
        (i: any) => i.etudiant.id === etudiantId
      );

      if (studentInscriptions.length === 0) {
        toast.error('Étudiant non trouvé');
        router.push('/dashboard/students');
        return;
      }

      setEtudiant(studentInscriptions[0].etudiant);
      setInscriptions(studentInscriptions);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      router.push('/dashboard/students');
    } finally {
      setLoading(false);
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

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };

  // Calculs statistiques
  const stats = {
    totalFormations: inscriptions.length,
    formationsActives: inscriptions.filter(i => i.statut === 'EN_COURS').length,
    formationsTerminees: inscriptions.filter(i => i.statut === 'TERMINEE').length,
    progressionMoyenne: inscriptions.length > 0
      ? Math.round(inscriptions.reduce((acc, i) => acc + i.progression, 0) / inscriptions.length)
      : 0,
    tempsTotal: inscriptions.reduce((acc, i) => acc + i.tempsTotal, 0),
    noteMoyenne: inscriptions.filter(i => i.note !== null).length > 0
      ? (inscriptions.reduce((acc, i) => acc + (i.note || 0), 0) / inscriptions.filter(i => i.note !== null).length).toFixed(1)
      : null,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!etudiant) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/students"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {etudiant.prenom} {etudiant.nom}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Profil et progression de l'étudiant
          </p>
        </div>
      </div>

      {/* Profil */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-6">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {etudiant.prenom[0]}{etudiant.nom[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Informations personnelles
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{etudiant.email}</p>
                </div>
              </div>
              {etudiant.telephone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{etudiant.telephone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Inscrit depuis</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(etudiant.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Formations</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalFormations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">En cours</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.formationsActives}</p>
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
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.formationsTerminees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Progression</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.progressionMoyenne}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Temps total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(stats.tempsTotal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Note moyenne</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.noteMoyenne ? `${stats.noteMoyenne}/20` : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des formations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Formations inscrites ({inscriptions.length})
        </h2>
        <div className="space-y-4">
          {inscriptions.map((inscription) => {
            const StatutBadge = getStatutBadge(inscription.statut);
            const StatutIcon = StatutBadge.icon;

            return (
              <div
                key={inscription.id}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {inscription.formation.titre}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${StatutBadge.color}`}>
                        <StatutIcon className="h-3 w-3" />
                        {StatutBadge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Niveau: {inscription.formation.niveau}</span>
                      <span>•</span>
                      <span>Durée: {inscription.formation.duree}h</span>
                      <span>•</span>
                      <span>Inscrit le {new Date(inscription.dateInscription).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/formations/${inscription.formation.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>

                {/* Progression */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
                    <span className="text-sm font-bold text-blue-600">{inscription.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${inscription.progression}%` }}
                    />
                  </div>
                </div>

                {/* Infos supplémentaires */}
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Temps passé</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatTime(inscription.tempsTotal)}
                    </p>
                  </div>
                  {inscription.note !== null && (
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Note finale</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {inscription.note}/20
                      </p>
                    </div>
                  )}
                  {inscription.dateCompletion && (
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Terminée le</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(inscription.dateCompletion).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions</h2>
        <div className="flex gap-4">
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <MessageSquare className="h-5 w-5" />
            Envoyer un message
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
            <Award className="h-5 w-5" />
            Délivrer un certificat
          </button>
        </div>
      </div>
    </div>
  );
}
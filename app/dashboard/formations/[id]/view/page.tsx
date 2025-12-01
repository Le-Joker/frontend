// app/dashboard/formations/[id]/view/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Clock,
  Play,
  Lock,
  Award,
  Download
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Formation {
  id: string;
  titre: string;
  description: string;
  image?: string;
  duree: number;
  niveau: string;
  formateur: {
    prenom: string;
    nom: string;
  };
  modules: Module[];
}

interface Module {
  id: string;
  titre: string;
  description: string;
  ordre: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  titre: string;
  type: string;
  duree: number;
  ordre: number;
  contenu?: string;
  videoUrl?: string;
  documentUrl?: string;
  isCompleted?: boolean;
}

interface Inscription {
  id: string;
  progression: number;
  statut: string;
  modulesCompletes: string[];
  tempsTotal: number;
  dateInscription: string;
}

export default function StudentFormationViewPage() {
  const params = useParams();
  const router = useRouter();
  const formationId = params.id as string;

  const [formation, setFormation] = useState<Formation | null>(null);
  const [inscription, setInscription] = useState<Inscription | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    fetchData();
  }, [formationId]);

  useEffect(() => {
    // Sauvegarder le temps passé toutes les 30 secondes
    const interval = setInterval(() => {
      if (currentLesson) {
        saveProgress();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentLesson]);

  const fetchData = async () => {
    try {
      const [formationRes, inscriptionRes, progressionsRes] = await Promise.all([
        api.get(`/formations/${formationId}`),
        api.get(`/inscriptions/etudiant`),
        api.get(`/inscriptions/progressions/${formationId}`)
      ]);

      const formationData = formationRes.data;
      const inscriptionData = inscriptionRes.data.find(
        (i: any) => i.formation.id === formationId
      );

      // Marquer les leçons complétées
      const progressions = progressionsRes.data;
      formationData.modules.forEach((module: Module) => {
        module.lessons.forEach((lesson: Lesson) => {
          const prog = progressions.find((p: any) => p.lessonId === lesson.id);
          lesson.isCompleted = prog?.isCompleted || false;
        });
      });

      setFormation(formationData);
      setInscription(inscriptionData);

      // Ouvrir tous les modules par défaut
      setExpandedModules(new Set(formationData.modules.map((m: Module) => m.id)));

      // Sélectionner la première leçon non complétée
      const firstIncomplete = formationData.modules
        .flatMap((m: Module) => m.lessons)
        .find((l: Lesson) => !l.isCompleted);

      if (firstIncomplete) {
        setCurrentLesson(firstIncomplete);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement');
      router.push('/dashboard/catalogue');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    if (!currentLesson || !inscription) return;

    try {
      const tempsVisionne = Math.floor((Date.now() - sessionStartTime) / 1000);

      await api.post('/inscriptions/progression/lesson', {
        lessonId: currentLesson.id,
        tempsVisionne
      });
    } catch (error) {
      console.error('Erreur sauvegarde progression:', error);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const tempsVisionne = Math.floor((Date.now() - sessionStartTime) / 1000);

      await api.post('/inscriptions/progression/lesson', {
        lessonId,
        tempsVisionne,
        score: 100 // Par défaut
      });

      toast.success('Leçon marquée comme complétée !');
      await fetchData(); // Recharger les données

      // Passer à la leçon suivante
      const nextLesson = getNextLesson(lessonId);
      if (nextLesson) {
        setCurrentLesson(nextLesson);
        setSessionStartTime(Date.now());
      }
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const getNextLesson = (currentLessonId: string): Lesson | null => {
    if (!formation) return null;

    const allLessons = formation.modules.flatMap(m => m.lessons).sort((a, b) => {
      const moduleA = formation.modules.find(m => m.lessons.some(l => l.id === a.id));
      const moduleB = formation.modules.find(m => m.lessons.some(l => l.id === b.id));
      if (moduleA?.ordre !== moduleB?.ordre) {
        return (moduleA?.ordre || 0) - (moduleB?.ordre || 0);
      }
      return a.ordre - b.ordre;
    });

    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    return allLessons[currentIndex + 1] || null;
  };

  const getLessonIcon = (type: string) => {
    const icons = {
      VIDEO: Video,
      DOCUMENT: FileText,
      TEXTE: BookOpen,
      QUIZ: CheckCircle,
    };
    return icons[type as keyof typeof icons] || BookOpen;
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!formation || !inscription) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Formation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/catalogue"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{formation.titre}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Par {formation.formateur.prenom} {formation.formateur.nom}
            </p>
          </div>
        </div>

        {inscription.progression === 100 && (
          <button
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Award className="h-5 w-5" />
            Télécharger le certificat
          </button>
        )}
      </div>

      {/* Progression globale */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Votre progression</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formation.modules.flatMap(m => m.lessons).filter(l => l.isCompleted).length} / {formation.modules.flatMap(m => m.lessons).length} leçons complétées
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{inscription.progression}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 inline mr-1" />
              {Math.floor(inscription.tempsTotal / 60)}h {inscription.tempsTotal % 60}min
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${inscription.progression}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar - Liste des leçons */}
        <div className="lg:col-span-1 space-y-4">
          {formation.modules.sort((a, b) => a.ordre - b.ordre).map((module) => (
            <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{module.titre}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {module.lessons.filter(l => l.isCompleted).length}/{module.lessons.length} leçons
                  </p>
                </div>
                {inscription.modulesCompletes?.includes(module.id) ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : null}
              </button>

              {expandedModules.has(module.id) && (
                <div className="p-2 space-y-1">
                  {module.lessons.sort((a, b) => a.ordre - b.ordre).map((lesson) => {
                    const LessonIcon = getLessonIcon(lesson.type);
                    const isActive = currentLesson?.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setCurrentLesson(lesson);
                          setSessionStartTime(Date.now());
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <LessonIcon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            {lesson.titre}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {lesson.duree} min
                          </p>
                        </div>
                        {lesson.isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contenu de la leçon */}
        <div className="lg:col-span-2">
          {currentLesson ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(getLessonIcon(currentLesson.type), {
                    className: 'h-6 w-6 text-blue-600'
                  })}
                  <span className="text-sm font-medium text-blue-600">
                    {currentLesson.type}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentLesson.titre}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {currentLesson.duree} minutes
                </p>
              </div>

              {/* Contenu selon le type */}
              {currentLesson.type === 'VIDEO' && currentLesson.videoUrl && (
                <div className="mb-6">
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={currentLesson.videoUrl}
                  >
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                </div>
              )}

              {currentLesson.type === 'TEXTE' && currentLesson.contenu && (
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.contenu }} />
                </div>
              )}

              {currentLesson.type === 'DOCUMENT' && currentLesson.documentUrl && (
                <div className="mb-6 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <a
                    href={currentLesson.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    Télécharger le document
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {!currentLesson.isCompleted ? (
                  <button
                    onClick={() => markLessonComplete(currentLesson.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Marquer comme terminée
                  </button>
                ) : (
                  <div className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg font-medium">
                    <CheckCircle className="h-5 w-5" />
                    Leçon complétée
                  </div>
                )}

                {getNextLesson(currentLesson.id) && (
                  <button
                    onClick={() => {
                      const next = getNextLesson(currentLesson.id);
                      if (next) {
                        setCurrentLesson(next);
                        setSessionStartTime(Date.now());
                      }
                    }}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                  >
                    Leçon suivante →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Sélectionnez une leçon pour commencer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
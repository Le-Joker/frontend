'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  BookOpen, 
  Video, 
  FileText,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Formation {
  id: string;
  titre: string;
  description: string;
  duree: number;
  niveau: string;
  status: string;
  image?: string;
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
}

export default function FormationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const formationId = params.id as string;
  
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  
  const [moduleForm, setModuleForm] = useState({ titre: '', description: '', ordre: 1 });
  const [lessonForm, setLessonForm] = useState({ titre: '', type: 'TEXTE', duree: 0, ordre: 1 });

  useEffect(() => {
    fetchFormation();
  }, [formationId]);

  const fetchFormation = async () => {
    try {
      const response = await api.get(`/formations/${formationId}`);
      setFormation(response.data);
      // Expand tous les modules par défaut
      setExpandedModules(new Set(response.data.modules.map((m: Module) => m.id)));
    } catch (error) {
      toast.error('Formation non trouvée');
      router.push('/dashboard/formations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/formations/${formationId}/modules`, moduleForm);
      toast.success('Module créé avec succès');
      setShowModuleForm(false);
      setModuleForm({ titre: '', description: '', ordre: 1 });
      fetchFormation();
    } catch (error) {
      toast.error('Erreur lors de la création du module');
    }
  };

  const handleCreateLesson = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    try {
      await api.post(`/formations/modules/${moduleId}/lessons`, lessonForm);
      toast.success('Leçon créée avec succès');
      setShowLessonForm(null);
      setLessonForm({ titre: '', type: 'TEXTE', duree: 0, ordre: 1 });
      fetchFormation();
    } catch (error) {
      toast.error('Erreur lors de la création de la leçon');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Supprimer ce module et toutes ses leçons ?')) return;
    try {
      await api.delete(`/formations/modules/${moduleId}`);
      toast.success('Module supprimé');
      fetchFormation();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Supprimer cette leçon ?')) return;
    try {
      await api.delete(`/formations/lessons/${lessonId}`);
      toast.success('Leçon supprimée');
      fetchFormation();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handlePublish = async () => {
    if (!formation?.modules.length) {
      toast.error('Ajoutez au moins un module avant de publier');
      return;
    }
    try {
      await api.post(`/formations/${formationId}/publish`);
      toast.success('Formation publiée avec succès !');
      fetchFormation();
    } catch (error) {
      toast.error('Erreur lors de la publication');
    }
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

  const getLessonIcon = (type: string) => {
    const icons = {
      VIDEO: Video,
      DOCUMENT: FileText,
      TEXTE: BookOpen,
      QUIZ: CheckCircle,
    };
    return icons[type as keyof typeof icons] || BookOpen;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!formation) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/formations"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{formation.titre}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {formation.niveau} • {formation.duree}h • {formation.status}
            </p>
          </div>
        </div>
        
        {formation.status === 'BROUILLON' && (
          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <CheckCircle className="h-5 w-5" />
            Publier la formation
          </button>
        )}
      </div>

      {/* Info Formation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">{formation.description}</p>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Modules ({formation.modules.length})
          </h2>
          <button
            onClick={() => setShowModuleForm(!showModuleForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Ajouter un module
          </button>
        </div>

        {/* Formulaire Module */}
        {showModuleForm && (
          <form onSubmit={handleCreateModule} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
            <input
              type="text"
              required
              placeholder="Titre du module"
              value={moduleForm.titre}
              onChange={(e) => setModuleForm({ ...moduleForm, titre: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <textarea
              placeholder="Description (optionnel)"
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowModuleForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Liste Modules */}
        {formation.modules.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucun module. Commencez par en créer un !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {formation.modules.sort((a, b) => a.ordre - b.ordre).map((module) => (
              <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Header Module */}
                <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    {expandedModules.has(module.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{module.titre}</h3>
                      {module.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {module.lessons.length} leçon(s)
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowLessonForm(showLessonForm === module.id ? null : module.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Ajouter une leçon"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Supprimer le module"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Formulaire Leçon */}
                {showLessonForm === module.id && (
                  <form onSubmit={(e) => handleCreateLesson(e, module.id)} className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Titre de la leçon"
                      value={lessonForm.titre}
                      onChange={(e) => setLessonForm({ ...lessonForm, titre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={lessonForm.type}
                        onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="TEXTE">Texte</option>
                        <option value="VIDEO">Vidéo</option>
                        <option value="DOCUMENT">Document</option>
                        <option value="QUIZ">Quiz</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        placeholder="Durée (min)"
                        value={lessonForm.duree}
                        onChange={(e) => setLessonForm({ ...lessonForm, duree: parseInt(e.target.value) })}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Créer la leçon
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLessonForm(null)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}

                {/* Liste Leçons */}
                {expandedModules.has(module.id) && (
                  <div className="p-4 space-y-2">
                    {module.lessons.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        Aucune leçon dans ce module
                      </p>
                    ) : (
                      module.lessons.sort((a, b) => a.ordre - b.ordre).map((lesson) => {
                        const LessonIcon = getLessonIcon(lesson.type);
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <LessonIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{lesson.titre}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duree} min • {lesson.type}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
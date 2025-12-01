import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, Award, BookOpen, Target } from 'lucide-react';

// Composant principal
export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Simuler fetch API
      const mockData = {
        overview: {
          totalEtudiants: 145,
          tauxCompletion: 78,
          tempsMoyen: 24.5,
          satisfactionMoyenne: 4.6
        },
        inscriptionsParMois: [
          { mois: 'Jan', inscriptions: 12, completions: 8 },
          { mois: 'Fév', inscriptions: 18, completions: 12 },
          { mois: 'Mar', inscriptions: 25, completions: 18 },
          { mois: 'Avr', inscriptions: 30, completions: 22 },
          { mois: 'Mai', inscriptions: 35, completions: 28 },
          { mois: 'Juin', inscriptions: 25, completions: 20 }
        ],
        progressionParFormation: [
          { formation: 'Maçonnerie Niveau 1', progression: 85, etudiants: 45 },
          { formation: 'Électricité Avancée', progression: 72, etudiants: 32 },
          { formation: 'Plomberie', progression: 90, etudiants: 28 },
          { formation: 'Menuiserie', progression: 68, etudiants: 40 }
        ],
        tauxEngagement: [
          { name: 'Très actifs', value: 35, color: '#10b981' },
          { name: 'Actifs', value: 45, color: '#3b82f6' },
          { name: 'Peu actifs', value: 15, color: '#f59e0b' },
          { name: 'Inactifs', value: 5, color: '#ef4444' }
        ],
        topModules: [
          { titre: 'Introduction BTP', vues: 450, completion: 95 },
          { titre: 'Sécurité chantier', vues: 420, completion: 88 },
          { titre: 'Lecture plans', vues: 380, completion: 82 },
          { titre: 'Outils professionnels', vues: 360, completion: 79 },
          { titre: 'Normes construction', vues: 340, completion: 75 }
        ],
        performanceLecons: [
          { nom: 'Vidéos', taux: 92, nombre: 45 },
          { nom: 'Textes', taux: 85, nombre: 60 },
          { nom: 'Documents', taux: 78, nombre: 30 },
          { nom: 'Quiz', taux: 88, nombre: 25 }
        ]
      };

      setAnalytics(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Avancés</h1>
          <p className="text-gray-600 mt-1">Analyse détaillée de vos formations</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
        >
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">90 derniers jours</option>
          <option value="1y">1 an</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Étudiants</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalEtudiants}</p>
              <p className="text-xs text-green-600">+12% vs mois dernier</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux complétion</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.tauxCompletion}%</p>
              <p className="text-xs text-green-600">+5% vs mois dernier</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Temps moyen</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.tempsMoyen}h</p>
              <p className="text-xs text-gray-600">par formation</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.satisfactionMoyenne}/5</p>
              <p className="text-xs text-green-600">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Inscriptions & Complétions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Inscriptions & Complétions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.inscriptionsParMois}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inscriptions" stroke="#3b82f6" strokeWidth={2} name="Inscriptions" />
              <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={2} name="Complétions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Taux d'engagement */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.tauxEngagement}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.tauxEngagement.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progression par formation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Progression par Formation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.progressionParFormation}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formation" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="progression" fill="#3b82f6" name="Progression %" />
            <Bar dataKey="etudiants" fill="#10b981" name="Étudiants" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Modules & Performance Leçons */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Modules */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 Modules</h3>
          <div className="space-y-4">
            {analytics.topModules.map((module, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-600">#{index + 1}</span>
                    <p className="font-medium text-gray-900">{module.titre}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>👁️ {module.vues} vues</span>
                    <span>✅ {module.completion}% complété</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance par type */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance par Type de Leçon</h3>
          <div className="space-y-4">
            {analytics.performanceLecons.map((type, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{type.nom}</span>
                  <span className="text-sm font-semibold text-blue-600">{type.taux}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${type.taux}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">{type.nombre} leçons</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommandations */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Insights & Recommandations
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-medium text-green-600 mb-2">✅ Point Fort</p>
            <p className="text-sm text-gray-700">Vos vidéos ont un taux de complétion de 92%, continuez !</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-medium text-orange-600 mb-2">⚠️ À Améliorer</p>
            <p className="text-sm text-gray-700">15% d'étudiants inactifs. Envoyez des rappels pour les réengager.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600 mb-2">💡 Suggestion</p>
            <p className="text-sm text-gray-700">Ajoutez plus de quiz interactifs pour augmenter l'engagement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Clock, CheckCircle, XCircle, Award, AlertCircle } from 'lucide-react';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

interface Question {
  id: number;
  type: string;
  question: string;
  points: number;
  options?: string[];
  correctAnswer?: number;
  correctAnswers?: number[];
}

interface TestData {
  message: string;
  duree: number;
  scoreMinimum: number;
  questions: Question[];
}

export default function TestFormateurPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [testStarted, setTestStarted] = useState(false);

  // Charger les questions du test
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await api.get('/users/test-formateur/questions');
        setTestData(response.data);
        setTimeLeft(response.data.duree * 60); // Convertir minutes en secondes
      } catch (error) {
        toast.error('Erreur lors du chargement du test');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [router]);

  // Timer
  useEffect(() => {
    if (!testStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeLeft]);

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const reponses = Object.entries(answers).map(([questionId, reponse]) => ({
        questionId: parseInt(questionId),
        reponse,
      }));

      const response = await api.post('/users/test-formateur/submit', { reponses });
      setResult(response.data);

      // Mettre à jour le rôle de l'utilisateur si le test est réussi
      if (response.data.status === 'PASSED' && user) {
        updateUser({ ...user, role: 'FORMATEUR' });
      }

      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du test...</p>
        </div>
      </div>
    );
  }

  if (!testData) return null;

  // Écran de résultat
  if (result) {
    const isPassed = result.status === 'PASSED';
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
            {isPassed ? (
              <>
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Félicitations ! 🎉</h1>
                <p className="text-xl text-gray-600">
                  Vous êtes maintenant <span className="text-blue-600 font-semibold">Formateur</span>
                </p>
              </>
            ) : (
              <>
                <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Test non réussi</h1>
                <p className="text-xl text-gray-600">
                  Ne vous découragez pas, vous pouvez réessayer !
                </p>
              </>
            )}

            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Votre score</span>
                <span className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {result.score}/100
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score minimum requis</span>
                <span className="text-lg font-semibold text-gray-900">{result.scoreMinimum}/100</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Aller au Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Écran de démarrage
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
              <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Formateur BTP</h1>
              <p className="text-gray-600">{testData.message}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 text-lg">Informations importantes</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Durée du test</div>
                    <div className="text-sm text-gray-600">{testData.duree} minutes</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Score minimum</div>
                    <div className="text-sm text-gray-600">{testData.scoreMinimum}/100 pour réussir</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Nombre de questions</div>
                    <div className="text-sm text-gray-600">{testData.questions.length} questions (QCM + questions ouvertes)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong>Attention :</strong> Le test démarre dès que vous cliquez sur le bouton ci-dessous. 
                  Assurez-vous d'être dans un endroit calme et d'avoir du temps devant vous.
                </div>
              </div>
            </div>

            <button
              onClick={() => setTestStarted(true)}
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Démarrer le test
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Passer pour le moment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interface du test
  const question = testData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / testData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec timer */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-900">Test Formateur BTP</div>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} sur {testData.questions.length}
              </div>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
          }`}>
            <Clock className="h-5 w-5" />
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progression</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              {question.points} points
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.question}</h2>
          </div>

          {/* QCM simple */}
          {question.type === 'qcm' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[question.id] === index
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={index}
                    checked={answers[question.id] === index}
                    onChange={() => handleAnswerChange(question.id, index)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* QCM multiple */}
          {question.type === 'multiple' && question.options && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">Plusieurs réponses possibles</p>
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[question.id]?.includes(index)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={answers[question.id]?.includes(index) || false}
                    onChange={(e) => {
                      const current = answers[question.id] || [];
                      const newAnswer = e.target.checked
                        ? [...current, index]
                        : current.filter((i: number) => i !== index);
                      handleAnswerChange(question.id, newAnswer);
                    }}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Question texte */}
          {question.type === 'text' && (
            <div>
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                rows={6}
                placeholder="Rédigez votre réponse ici..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Minimum 20 caractères pour obtenir des points
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Question précédente
            </button>

            {currentQuestion < testData.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Question suivante →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
              >
                {submitting ? 'Soumission...' : 'Terminer le test ✓'}
              </button>
            )}
          </div>
        </div>

        {/* Indicateur de questions répondues */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-wrap gap-2">
            {testData.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`h-10 w-10 rounded-lg font-medium transition-all ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[q.id] !== undefined
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
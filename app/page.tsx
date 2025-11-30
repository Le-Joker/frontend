'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Building2, GraduationCap, Users, FileText, CheckCircle, ArrowRight, Star, Menu, X } from 'lucide-react';
import { api } from '@/lib/axios'

interface Statistics {
  professionnels: number;
  projets: number;
  satisfaction: number;
  formations: number;
}

interface Testimonial {
  id: string;
  contenu: string;
  note: number;
  userName: string;
  userRole: string;
  createdAt: string;
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>({
    professionnels: 50,
    projets: 100,
    satisfaction: 98,
    formations: 0,
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, testimonialsRes] = await Promise.all([
          api.get('/public/statistics'),
          api.get('/public/testimonials'),
        ]);
        
        setStatistics(statsRes.data);
        setTestimonials(testimonialsRes.data);
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Administrateur',
      FORMATEUR: 'Formateur BTP',
      ETUDIANT: 'Étudiant en BTP',
      CLIENT: 'Entrepreneur',
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {/* <Building2 className="h-8 w-8 text-blue-600" /> */}
              <span className="text-2xl font-bold text-gray-900">INTELLECT BUILDING</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#fonctionnalites" className="text-gray-600 hover:text-blue-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#apropos" className="text-gray-600 hover:text-blue-600 transition-colors">
                À propos
              </a>
              <a href="#temoignages" className="text-gray-600 hover:text-blue-600 transition-colors">
                Témoignages
              </a>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Connexion
              </Link>
              <Link href="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Commencer
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#fonctionnalites" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2">Fonctionnalités</a>
                <a href="#apropos" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2">À propos</a>
                <a href="#temoignages" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2">Témoignages</a>
                <div className="border-t pt-4 px-4 space-y-2">
                  <Link href="/login" className="block text-center px-6 py-2">Connexion</Link>
                  <Link href="/register" className="block text-center px-6 py-2 bg-blue-600 text-white rounded-lg">Commencer</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                Plateforme BTP
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transformez votre <span className="text-blue-600">expertise BTP</span> en succès
              </h1>
              <p className="text-xl text-gray-600">
                La plateforme tout-en-un pour gérer vos chantiers, former vos équipes,
                et développer votre activité dans le secteur du bâtiment.
              </p>
              
              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">{loading ? '...' : `${statistics.professionnels}+`}</div>
                  <div className="text-gray-600">Professionnels</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{loading ? '...' : `${statistics.projets}+`}</div>
                  <div className="text-gray-600">Projets réalisés</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{loading ? '...' : `${statistics.satisfaction}%`}</div>
                  <div className="text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80" 
                alt="Chantier" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités par rôle */}
      <section id="fonctionnalites" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Une solution pour chaque professionnel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Que vous soyez formateur, étudiant, client ou gestionnaire, INTELLECT BUILDING s'adapte à vos besoins.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Formateur */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="h-14 w-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Formateur</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Créez et gérez vos formations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Test de certification inclus</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Suivi des progressions</span>
                </li>
              </ul>
            </div>

            {/* Étudiant */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="h-14 w-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Étudiant</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Accédez aux formations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Suivez votre progression</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Obtenez des certifications</span>
                </li>
              </ul>
            </div>

            {/* Client */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="h-14 w-14 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Client</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Demandez des devis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Suivez vos chantiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Communication en temps réel</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos avec image */}
      <section id="apropos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Équipe de construction professionnelle"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Une plateforme pensée par des professionnels du BTP
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                INTELLECT BUILDING est née de l'expérience terrain de professionnels du bâtiment
                qui ont identifié les besoins réels du secteur : formation continue, gestion de projets,
                et mise en relation efficace.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Notre mission : digitaliser et simplifier le quotidien des acteurs du BTP tout en
                maintenant l'excellence et la sécurité qui caractérisent ce secteur.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-white" />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">500+ professionnels</div>
                  <div className="text-sm text-gray-600">nous font confiance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Ils utilisent INTELLECT BUILDING</h2>
            <p className="text-xl text-gray-600">Découvrez les retours de nos utilisateurs</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-600 text-lg">Soyez le premier à partager votre expérience !</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="p-8 bg-gray-50 rounded-2xl">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < t.note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6">"{t.contenu}"</p>
                  <div>
                    <div className="font-semibold">{t.userName}</div>
                    <div className="text-sm text-gray-600">{getRoleLabel(t.userRole)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Prêt à digitaliser votre activité BTP ?
          </h2>
          <p className="text-xl text-blue-100">
            Rejoignez des centaines de professionnels qui ont déjà fait le choix de l'excellence.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold text-lg"
          >
            Commencer maintenant
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {/* <Building2 className="h-8 w-8 text-blue-500" /> */}
                <span className="text-xl font-bold text-white">INTELLECT BUILDING</span>
              </div>
              <p className="text-sm">
                La plateforme SaaS dédiée aux professionnels du BTP.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Produit</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 INTELLECT BUILDING. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
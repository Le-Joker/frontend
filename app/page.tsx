'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Building2, GraduationCap, Users, FileText, CheckCircle, ArrowRight, Star, Menu, X } from 'lucide-react';
import { api } from '@/lib/axios';

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
      {/* Navigation - Responsive complet */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Logo - Responsive */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">INTELLECT BUILDING</span>
            </div>
            
            {/* Desktop Menu - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
              <a href="#fonctionnalites" className="text-sm xl:text-base text-gray-600 hover:text-blue-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#apropos" className="text-sm xl:text-base text-gray-600 hover:text-blue-600 transition-colors">
                À propos
              </a>
              <a href="#temoignages" className="text-sm xl:text-base text-gray-600 hover:text-blue-600 transition-colors">
                Témoignages
              </a>
            </div>
            
            {/* CTA Buttons - Responsive */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4">
              <Link href="/login" className="text-xs sm:text-sm lg:text-base text-gray-600 hover:text-blue-600 transition-colors font-medium px-2 lg:px-3 py-1.5 lg:py-2">
                Connexion
              </Link>
              <Link href="/register" className="px-3 sm:px-4 lg:px-5 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 bg-blue-600 text-white text-xs sm:text-sm lg:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Commencer
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 sm:py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <a href="#fonctionnalites" onClick={() => setMobileMenuOpen(false)} className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base hover:bg-gray-50 rounded-lg transition-colors">Fonctionnalités</a>
                <a href="#apropos" onClick={() => setMobileMenuOpen(false)} className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base hover:bg-gray-50 rounded-lg transition-colors">À propos</a>
                <a href="#temoignages" onClick={() => setMobileMenuOpen(false)} className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base hover:bg-gray-50 rounded-lg transition-colors">Témoignages</a>
                <div className="border-t pt-2 sm:pt-3 px-3 sm:px-4 space-y-2">
                  <Link href="/login" className="block text-center px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base hover:bg-gray-50 rounded-lg transition-colors">Connexion</Link>
                  <Link href="/register" className="block text-center px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors">Commencer</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Responsive */}
      <section className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-semibold">
                Plateforme BTP
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Transformez votre <span className="text-blue-600">expertise BTP</span> en succès
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600">
                La plateforme tout-en-un pour gérer vos chantiers, former vos équipes,
                et développer votre activité dans le secteur du bâtiment.
              </p>
              
              {/* Stats - Responsive Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 pt-2 sm:pt-4">
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{loading ? '...' : `${statistics.professionnels}+`}</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Professionnels</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{loading ? '...' : `${statistics.projets}+`}</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Projets</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{loading ? '...' : `${statistics.satisfaction}%`}</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
            
            {/* Image - Responsive */}
            <div className="relative mt-6 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80" 
                alt="Chantier" 
                className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl lg:shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités par rôle - Responsive Grid */}
      <section id="fonctionnalites" className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Une solution pour chaque professionnel
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Que vous soyez formateur, étudiant, client ou gestionnaire, INTELLECT BUILDING s'adapte à vos besoins.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {/* Formateur Card */}
            <div className="group p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl lg:rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 sm:hover:-translate-y-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Formateur</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Créez et gérez vos formations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Test de certification inclus</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Suivi des progressions</span>
                </li>
              </ul>
            </div>

            {/* Étudiant Card */}
            <div className="group p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl lg:rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 sm:hover:-translate-y-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Étudiant</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Accédez aux formations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Suivez votre progression</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Obtenez des certifications</span>
                </li>
              </ul>
            </div>

            {/* Client Card */}
            <div className="group p-4 sm:p-6 md:p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl lg:rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 sm:hover:-translate-y-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Client</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Demandez des devis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Suivez vos chantiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Communication temps réel</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos - Responsive */}
      <section id="apropos" className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Équipe BTP"
                className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl lg:shadow-2xl w-full"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Une plateforme pensée par des professionnels du BTP
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                INTELLECT BUILDING est née de l'expérience terrain de professionnels du bâtiment
                qui ont identifié les besoins réels du secteur : formation continue, gestion de projets,
                et mise en relation efficace.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                Notre mission : digitaliser et simplifier le quotidien des acteurs du BTP tout en
                maintenant l'excellence et la sécurité qui caractérisent ce secteur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Prêt à digitaliser votre activité BTP ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100">
            Rejoignez des centaines de professionnels qui ont déjà fait le choix de l'excellence.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold text-sm sm:text-base md:text-lg"
          >
            Commencer maintenant
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-10 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
              <span className="text-base sm:text-lg md:text-xl font-bold text-white">INTELLECT BUILDING</span>
              <p className="text-xs sm:text-sm">
                La plateforme SaaS dédiée aux professionnels du BTP.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Produit</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Entreprise</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Légal</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 md:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            <p>&copy; 2025 INTELLECT BUILDING. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
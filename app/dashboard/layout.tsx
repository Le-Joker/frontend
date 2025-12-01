'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Award,
  Building,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    router.push('/');
  };

  const getNavigation = () => {
    const baseNav = [
      { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    ];

    if (user.role === 'ADMIN') {
      return [
        ...baseNav,
        { name: 'Utilisateurs', href: '/admin/users', icon: Users },
        { name: 'Formations', href: '/admin/formations', icon: GraduationCap },
        { name: 'Statistiques', href: '/admin/stats', icon: Award },
        { name: 'Témoignages', href: '/admin/testimonials', icon: MessageSquare },
      ];
    }

    if (user.role === 'FORMATEUR') {
      return [
        ...baseNav,
        { name: 'Mes formations', href: '/dashboard/formations', icon: GraduationCap },
        { name: 'Créer formation', href: '/dashboard/formations/create', icon: FileText },
        { name: 'Mes étudiants', href: '/dashboard/students', icon: Users },
      ];
    }

    if (user.role === 'ETUDIANT') {
      return [
        ...baseNav,
        { name: 'Catalogue', href: '/dashboard/catalogue', icon: GraduationCap },
        { name: 'Mes formations', href: '/dashboard/formations', icon: GraduationCap },
        { name: 'Ma progression', href: '/dashboard/progress', icon: Award },
      ];
    }

    if (user.role === 'CLIENT') {
      return [
        ...baseNav,
        { name: 'Mes devis', href: '/dashboard/devis', icon: FileText },
        { name: 'Mes chantiers', href: '/dashboard/chantiers', icon: Building },
        { name: 'Nouvelle demande', href: '/dashboard/devis/new', icon: FileText },
      ];
    }

    return baseNav;
  };

  const navigation = getNavigation();

  const getRoleBadge = () => {
    const badges: Record<string, { color: string; label: string }> = {
      ADMIN: { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', label: 'Administrateur' },
      FORMATEUR: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', label: 'Formateur' },
      ETUDIANT: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300', label: 'Étudiant' },
      CLIENT: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', label: 'Client' },
    };
    return badges[user.role] || badges.ETUDIANT;
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar Desktop - Responsive Width */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-56 lg:w-64 xl:w-72 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors">
          {/* Logo - Responsive */}
          <div className="flex h-14 lg:h-16 items-center gap-1.5 lg:gap-2 px-4 lg:px-6 border-b border-gray-200 dark:border-gray-700">
            {/* <Building2 className="h-6 lg:h-7 xl:h-8 w-6 lg:w-7 xl:w-8 text-blue-600" /> */}
            <span className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white">INTELLECT</span>
          </div>

          {/* Profile Card - Responsive */}
          <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm lg:text-base font-semibold flex-shrink-0">
                {user.prenom[0]}{user.nom[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.prenom} {user.nom}
                </p>
                <span className={`inline-block px-2 py-0.5 text-[10px] lg:text-xs font-medium rounded-full ${roleBadge.color}`}>
                  {roleBadge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation - Responsive */}
          <nav className="flex-1 space-y-0.5 lg:space-y-1 px-2 lg:px-3 py-3 lg:py-4 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                >
                  <Icon className="h-4 lg:h-5 w-4 lg:w-5" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer - Responsive */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2 lg:p-3 space-y-0.5 lg:space-y-1">
            <div className="flex items-center justify-between px-2 lg:px-3 py-1.5 lg:py-2">
              <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Thème</span>
              <ThemeToggle />
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="h-4 lg:h-5 w-4 lg:w-5" />
              Paramètres
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 text-xs lg:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="h-4 lg:h-5 w-4 lg:w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 sm:w-72 flex-col bg-white dark:bg-gray-800">
            <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                {/* <Building2 className="h-6 sm:h-7 w-6 sm:w-7 text-blue-600" /> */}
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">INTELLECT</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 dark:text-gray-400">
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {user.prenom[0]}{user.nom[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.prenom} {user.nom}
                  </p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-1">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Thème</span>
                <ThemeToggle />
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
                Paramètres
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Mobile - Responsive */}
      <div className="md:hidden sticky top-0 z-10 flex h-14 sm:h-16 items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 transition-colors">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 dark:text-gray-400">
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" /> */}
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">INTELLECT</span>
        </div>
        <button className="text-gray-500 dark:text-gray-400">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Main Content - Responsive Padding */}
      <main className="md:pl-56 lg:pl-64 xl:pl-72">
        <div className="py-4 sm:py-5 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
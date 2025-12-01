'use client';

import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  Home,
  BarChart3,
  FileText,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Home },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Statistiques', href: '/admin/stats', icon: BarChart3 },
    { name: 'Témoignages', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Formations', href: '/admin/formations', icon: FileText },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* Sidebar Desktop - Hidden on mobile/tablet */}
        <aside className="hidden lg:flex lg:w-56 xl:w-64 lg:flex-col bg-gray-900 text-white">
          <div className="p-4 lg:p-5 xl:p-6 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-red-500" />
              <span className="text-lg lg:text-xl font-bold">Admin Panel</span>
            </div>
            <p className="text-xs text-gray-400 hidden xl:block">Gestion de la plateforme</p>
          </div>

          <nav className="p-3 lg:p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="hidden xl:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-3 lg:p-4 border-t border-gray-800">
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-2.5 lg:p-3">
              <div className="flex items-center gap-2 text-xs text-red-300">
                <Shield className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="font-semibold hidden xl:inline">Zone Sécurisée</span>
              </div>
              <p className="text-xs text-red-400 mt-1 hidden xl:block">
                Accès réservé aux administrateurs
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 flex w-64 sm:w-72 md:w-80 flex-col bg-gray-900 text-white">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                  <span className="text-lg sm:text-xl font-bold">Admin Panel</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-3 sm:p-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Sidebar Footer */}
              <div className="p-3 sm:p-4 border-t border-gray-800">
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-red-300">
                    <Shield className="h-4 w-4" />
                    <span className="font-semibold">Zone Sécurisée</span>
                  </div>
                  <p className="text-xs text-red-400 mt-1">
                    Accès réservé aux administrateurs
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 h-14 sm:h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              <span className="text-base sm:text-lg font-bold text-gray-900">Admin</span>
            </div>
            <div className="w-9"></div> {/* Spacer for centering */}
          </div>

          {/* Content Area - Responsive Padding */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
'use client';

import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  Home,
  BarChart3,
  FileText
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
        {/* Sidebar Admin */}
        <aside className="w-64 bg-gray-900 text-white">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <p className="text-xs text-gray-400">Gestion de la plateforme</p>
          </div>

          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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

          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
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
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
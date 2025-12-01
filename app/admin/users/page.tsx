'use client';

import { useState, useEffect } from 'react';
import { Trash2, Search, Shield, UserCheck, User as UserIcon } from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`⚠️ ATTENTION !\n\nVoulez-vous vraiment supprimer l'utilisateur :\n${email}\n\nCette action est IRRÉVERSIBLE.`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success('Utilisateur supprimé avec succès');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-red-100 text-red-700',
      FORMATEUR: 'bg-blue-100 text-blue-700',
      ETUDIANT: 'bg-purple-100 text-purple-700',
      CLIENT: 'bg-green-100 text-green-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'FORMATEUR':
        return <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">{users.length} utilisateurs au total</p>
          </div>
        </div>

        {/* Search Bar - Responsive */}
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par email, nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {['ADMIN', 'FORMATEUR', 'ETUDIANT', 'CLIENT'].map((role) => {
          const count = users.filter((u) => u.role === role).length;
          return (
            <div key={role} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-2 sm:p-3 rounded-lg ${getRoleColor(role)}`}>
                  {getRoleIcon(role)}
                </div>
                <div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">{role}S</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table - Responsive */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-900">Utilisateur</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-900">Email</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-900">Téléphone</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-900">Rôle</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-900">Inscription</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-right text-xs xl:text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="font-medium text-sm xl:text-base text-gray-900">
                      {user.prenom} {user.nom}
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 text-sm xl:text-base text-gray-600">{user.email}</td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 text-sm xl:text-base text-gray-600">{user.telephone || '-'}</td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <span className={`inline-flex items-center gap-1 px-2 xl:px-3 py-1 rounded-full text-xs xl:text-sm font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <span className={`inline-flex px-2 xl:px-3 py-1 rounded-full text-xs xl:text-sm font-medium ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 text-sm xl:text-base text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="inline-flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-3 w-3 xl:h-4 xl:w-4" />
                      <span className="hidden xl:inline">Supprimer</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards - Visible only on small screens */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                    {user.prenom} {user.nom}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</div>
                </div>
                <button
                  onClick={() => handleDelete(user.id, user.email)}
                  className="ml-2 p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  {user.role}
                </span>
                <span className={`inline-flex px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-gray-500">
                <span>{user.telephone || 'Pas de téléphone'}</span>
                <span>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
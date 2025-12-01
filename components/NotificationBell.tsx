'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { api } from '@/lib/axios';
import { getSocket } from '@/lib/socket';
import { toast } from 'sonner';
import Link from 'next/link';

interface Notification {
  id: string;
  titre: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    if (socket) {
      socket.on('notification:receive', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Toast notification
        toast.info(notification.titre, {
          description: notification.message,
          action: notification.link ? {
            label: 'Voir',
            onClick: () => window.location.href = notification.link!,
          } : undefined,
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('notification:receive');
      }
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Erreur count:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur mark read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur mark all:', error);
    }
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      FORMATION: 'text-blue-600',
      DEVIS: 'text-green-600',
      CHANTIER: 'text-orange-600',
      MESSAGE: 'text-purple-600',
      SYSTEME: 'text-gray-600',
    };
    return colors[type as keyof typeof colors] || colors.SYSTEME;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-40 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notif.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${getNotificationColor(notif.type)}`}>
                          <Bell className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {notif.titre}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(notif.createdAt).toLocaleString('fr-FR')}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {notif.link && (
                              <Link
                                href={notif.link}
                                onClick={() => {
                                  markAsRead(notif.id);
                                  setIsOpen(false);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Voir →
                              </Link>
                            )}
                            {!notif.isRead && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              >
                                Marquer comme lu
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
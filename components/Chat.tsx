'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, Users as UsersIcon, Minimize2, Maximize2 } from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/lib/store/auth-store';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface OnlineUser {
  userId: string;
  userName: string;
}

export default function Chat() {
  const { user } = useAuthStore();
  const socket = getSocket();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Écouter les nouveaux messages
    socket.on('message:receive', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Écouter les utilisateurs en ligne
    socket.on('users:online-list', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    // Écouter les notifications de frappe
    socket.on('typing:user-started', ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
    });

    socket.on('typing:user-stopped', ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      socket.off('message:receive');
      socket.off('users:online-list');
      socket.off('typing:user-started');
      socket.off('typing:user-stopped');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !socket) return;

    socket.emit('message:send', {
      content: inputValue,
    });

    setInputValue('');
    
    // Arrêter l'indicateur de frappe
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing:stop', {});
  };

  const handleTyping = (value: string) => {
    setInputValue(value);

    if (!socket) return;

    // Commencer l'indicateur de frappe
    socket.emit('typing:start', {});

    // Arrêter après 2 secondes d'inactivité
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', {});
    }, 2000);
  };

  if (!socket) return null;

  return (
    <>
      {/* Bouton flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 h-12 w-12 sm:h-14 sm:w-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
          aria-label="Ouvrir le chat"
        >
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
          {onlineUsers.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
              {onlineUsers.length}
            </span>
          )}
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-all ${
          isMinimized ? 'w-72 h-14' : 'w-full sm:w-96 h-[32rem]'
        } max-w-[calc(100vw-2rem)]`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Chat en direct</h3>
                <p className="text-xs opacity-90 hidden sm:block">
                  {onlineUsers.length} en ligne
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 sm:p-2 hover:bg-blue-700 rounded-lg transition-colors"
                aria-label={isMinimized ? 'Agrandir' : 'Réduire'}
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 hover:bg-blue-700 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Zone des messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 h-[calc(100%-8rem)] sm:h-[calc(100%-9rem)]">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8 sm:py-12">
                    <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-xs sm:text-sm">Aucun message pour le moment</p>
                  </div>
                )}

                {messages.map((message) => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[75%] ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'} rounded-lg px-3 py-2 sm:px-4 sm:py-3`}>
                        {!isOwn && (
                          <p className="text-xs font-semibold mb-1 opacity-75">
                            {message.senderName}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm break-words">{message.content}</p>
                        <p className="text-[10px] sm:text-xs opacity-75 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Indicateur de frappe */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Envoyer"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
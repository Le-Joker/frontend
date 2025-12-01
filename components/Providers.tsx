'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { initSocket, disconnectSocket } from '@/lib/socket';
import Chat from '@/components/Chat';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      initSocket(token);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, token]);

  return (
    <>
      {children}
      {isAuthenticated && <Chat />}
    </>
  );
}
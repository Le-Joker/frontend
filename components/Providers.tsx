// frontend/components/Providers.tsx

'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { initSocket, disconnectSocket } from '@/lib/socket';
import Chat from '@/components/Chat';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (user && token) {
      initSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, [user, token]);

  return (
    <>
      {children}
      {user && <Chat />}
    </>
  );
}
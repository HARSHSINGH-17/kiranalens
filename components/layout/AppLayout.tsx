'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuthStore } from '@/store/authStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  
  // Routes where sidebar and topbar should be hidden
  const isAuthRoute = pathname?.startsWith('/auth') || pathname === '/';

  // Show clean layout for auth pages or unauthenticated users
  if (isAuthRoute || !isAuthenticated) {
    return <main className="h-screen overflow-y-auto">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/Components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Si on est sur la page login, on ne fait rien
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    if (!token) {
      router.push('/admin/login');
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Vérification...</div>;
  }

  // Si on est sur la page de login, on affiche seulement le contenu sans sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Sinon, on affiche le layout complet avec sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
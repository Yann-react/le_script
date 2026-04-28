'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, BookOpen, Tag, MessageSquare, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    window.location.href = '/admin/login';
  };

  return (
    <div className="w-72 bg-[#0B1C40] text-white flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
           <Image
                    src="/logo.jpeg"
                    alt="logo"
                    width={70}
                    height={50}
                    className="object-contain cursor-pointer"
                  />
        <p className="text-sm text-white/60 mt-1">Administration</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Link 
              href="/admin" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname === '/admin' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/livres" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname.startsWith('/admin/livres') ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <BookOpen size={20} />
              Gestion des Livres
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/types" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname.startsWith('/admin/types') ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <Tag size={20} />
              Types de Livres
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/avis" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname.startsWith('/admin/avis') ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <MessageSquare size={20} />
              Gestion des Avis
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-white/10 rounded-xl transition"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
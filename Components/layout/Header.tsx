import Image from 'next/image';
import React from 'react';

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="shrink-0">
          <Image
            src="/logo.jpeg"
            alt="logo"
            width={70}
            height={50}
            className="object-contain cursor-pointer"
            onClick={() => onNavigate('Accueil')}
          />
        </div>

        <div>
          <ul className="flex items-center gap-6 md:gap-10 list-none">
            {['Accueil', 'Nouveau ouvrage', 'Article'].map((item) => (
              <li
                key={item}
                onClick={() => onNavigate(item)}
                className="text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-red-700 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0B1C40] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          
          {/* Logo + Description */}
          <div className="md:col-span-5 space-y-4">
            <Image
              src="/logo.jpeg"
              alt="LeScript Logo"
              width={80}
              height={60}
              className="object-contain"
            />
            <p className="max-w-md text-sm leading-relaxed text-[#CBD5E1]">
              Une sélection soignée de livres pour inspirer, apprendre et voyager. 
              Découvrez votre prochaine lecture favorite.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#94A3B8]">Navigation</h3>
            <div className="flex flex-col gap-3 text-sm text-[#CBD5E1]">
              <Link href="/" className="hover:text-white transition-colors">
                Accueil
              </Link>
              <Link href="#nouveaux-articles" className="hover:text-white transition-colors">
                Nouveaux Articles
              </Link>
              <Link href="#articles" className="hover:text-white transition-colors">
                Articles
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#94A3B8]">Contact</h3>
            <div className="space-y-3 text-sm text-[#CBD5E1]">
              <p>Email : XXXXXXXX</p>
              <p>Téléphone : XXXXXXXXXXX</p>
            
            </div>
          </div>
        </div>

        {/* Barre inférieure */}
        <div className="mt-16 pt-8 border-t border-slate-700 text-xs text-[#94A3B8] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p>© 2026 LeScript - Tous droits réservés</p>
          
 
        </div>
      </div>
    </footer>
  );
}
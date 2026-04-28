'use client';

import { useEffect, useState } from 'react';
import { BookOpen, MessageSquare, Tag, TrendingUp } from 'lucide-react';
import {  Star } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLivres: 0,
    totalAvis: 0,
    totalTypes: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer tous les livres
        const livresRes = await fetch('http://localhost:3005/livres');
        const livres = await livresRes.json();

        // Récupérer tous les avis
        const avisRes = await fetch('http://localhost:3005/avis');
        const avis = await avisRes.json();

        // Récupérer tous les types
        const typesRes = await fetch('http://localhost:3005/types-livre');
        const types = await typesRes.json();

        // Calcul de la note moyenne globale
        const totalNotes = avis.reduce((sum: number, a: any) => sum + a.notation, 0);
        const averageRating = avis.length > 0 ? (totalNotes / avis.length).toFixed(1) : 0;

        setStats({
          totalLivres: livres.length,
          totalAvis: avis.length,
          totalTypes: types.length,
          averageRating: parseFloat(averageRating as string),
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Chargement des statistiques...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#0B1C40]">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Livres */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Livres totaux</p>
              <p className="text-4xl font-bold mt-2 text-[#0B1C40]">{stats.totalLivres}</p>
            </div>
            <BookOpen className="text-[#BF0F0F]" size={48} />
          </div>
        </div>

        {/* Total Avis */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avis reçus</p>
              <p className="text-4xl font-bold mt-2 text-[#0B1C40]">{stats.totalAvis}</p>
            </div>
            <MessageSquare className="text-[#BF0F0F]" size={48} />
          </div>
        </div>

        {/* Types de livres */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Types de livres</p>
              <p className="text-4xl font-bold mt-2 text-[#0B1C40]">{stats.totalTypes}</p>
            </div>
            <Tag className="text-[#BF0F0F]" size={48} />
          </div>
        </div>

        {/* Note moyenne globale */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Note moyenne globale</p>
              <p className="text-4xl font-bold mt-2" style={{ color: '#BF0F0F' }}>
                {stats.averageRating} 
                <span className="text-2xl">⭐</span>
              </p>
            </div>
            <Star className="text-[#BF0F0F]" size={48} />
          </div>
        </div>
      </div>

      {/* Message de bienvenue */}

    </div>
  );
}
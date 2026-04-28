'use client';

import { useEffect, useState } from 'react';
import { Trash2, X, Star } from 'lucide-react';
interface Avis {
  id: number;
  nom: string;
  commentaire: string;
  notation: number;
  dateAvis: string;
  livre?: {
    nom: string;
    auteur: string;
  };
}

export default function AdminAvis() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avisToDelete, setAvisToDelete] = useState<Avis | null>(null);

  // Récupérer tous les avis
  const fetchAvis = async () => {
    try {
      const res = await fetch('http://localhost:3005/avis');
      const data = await res.json();
      setAvis(data);
    } catch (error) {
      console.error("Erreur chargement avis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvis();
  }, []);

  // Supprimer un avis
  const handleDelete = async () => {
    if (!avisToDelete) return;

    try {
      const res = await fetch(`http://localhost:3005/avis/${avisToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setAvis(avis.filter(a => a.id !== avisToDelete.id));
        setShowDeleteModal(false);
        setAvisToDelete(null);
        alert('Avis supprimé avec succès');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur de connexion');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Chargement des avis...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0B1C40]">Gestion des Avis</h1>
        <p className="text-gray-500">Total : {avis.length} avis</p>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Livre</th>
              <th className="px-6 py-4 text-left">Commentaire</th>
              <th className="px-6 py-4 text-center">Note</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {avis.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{review.nom}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{review.livre?.nom}</p>
                    <p className="text-sm text-gray-500">{review.livre?.auteur}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 max-w-md">
                  {review.commentaire}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <div className="flex text-[#BF0F0F]">
                      {Array.from({ length: review.notation }).map((_, i) => (
                        <Star key={i} size={18} className="fill-current" />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(review.dateAvis).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => {
                        setAvisToDelete(review);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Confirmation Suppression */}
      {showDeleteModal && avisToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Voulez-vous vraiment supprimer l'avis de <strong>{avisToDelete.nom}</strong> ?
              <br />
              Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
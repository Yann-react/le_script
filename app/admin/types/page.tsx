'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface TypeLivre {
  id: number;
  nomType: string;
}

export default function AdminTypes() {
  const [types, setTypes] = useState<TypeLivre[]>([]);
  const [loading, setLoading] = useState(true);

  // États des modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentType, setCurrentType] = useState<TypeLivre | null>(null);
  const [formData, setFormData] = useState({ nomType: '' });

  // Récupérer les types
  const fetchTypes = async () => {
    try {
      const res = await fetch('http://localhost:3005/types-livre');
      const data = await res.json();
      setTypes(data);
    } catch (error) {
      console.error("Erreur chargement types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Ouvrir modal Ajout
  const openAddModal = () => {
    setFormData({ nomType: '' });
    setShowAddModal(true);
  };

  // Ouvrir modal Modification
  const openEditModal = (type: TypeLivre) => {
    setCurrentType(type);
    setFormData({ nomType: type.nomType });
    setShowEditModal(true);
  };

  // Soumission (Ajout ou Modification)
// Soumission (Ajout ou Modification)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Vous devez être connecté pour effectuer cette action");
    return;
  }

  try {
    const method = showEditModal ? 'PATCH' : 'POST';
    const url = showEditModal 
      ? `http://localhost:3005/types-livre/${currentType?.id}` 
      : 'http://localhost:3005/types-livre';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`   // ← C'est ça qui manquait
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowAddModal(false);
      setShowEditModal(false);
      fetchTypes();
      alert(showEditModal ? 'Type modifié avec succès' : 'Type ajouté avec succès');
    } else {
      const errorData = await res.json().catch(() => ({}));
      alert(errorData.message || 'Erreur lors de l\'opération');
    }
  } catch (error) {
    console.error(error);
    alert('Erreur de connexion au serveur');
  }
};

// Suppression
const handleDelete = async () => {
  if (!currentType) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Vous devez être connecté");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3005/types-livre/${currentType.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`   // ← Ajout du token
      }
    });

    if (res.ok) {
      setTypes(types.filter(t => t.id !== currentType.id));
      setShowDeleteModal(false);
      setCurrentType(null);
      alert('Type supprimé avec succès');
    } else {
      alert('Erreur lors de la suppression');
    }
  } catch (error) {
    alert('Erreur de connexion');
  }
};
  if (loading) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0B1C40]">Gestion des Types de Livres</h1>
        <button 
          onClick={openAddModal}
          className="bg-[#BF0F0F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-red-700 transition"
        >
          <Plus size={20} />
          Ajouter un type
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Nom du Type</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {types.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">#{type.id}</td>
                <td className="px-6 py-4 font-medium">{type.nomType}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => openEditModal(type)}
                      className="text-blue-600 hover:text-blue-700 transition"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentType(type);
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

      {/* ====================== MODAL AJOUT / MODIFICATION ====================== */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0B1C40]">
                {showAddModal ? 'Ajouter un type de livre' : 'Modifier le type'}
              </h2>
              <button 
                onClick={() => {setShowAddModal(false); setShowEditModal(false);}}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du Type</label>
                <input
                  type="text"
                  value={formData.nomType}
                  onChange={(e) => setFormData({ nomType: e.target.value })}
                  className="w-full px-4 py-3 border rounded-2xl"
                  placeholder="Ex: Roman, Science-Fiction..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {setShowAddModal(false); setShowEditModal(false);}}
                  className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#BF0F0F] text-white rounded-2xl font-bold"
                >
                  {showAddModal ? 'Ajouter' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && currentType && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Voulez-vous vraiment supprimer le type <strong>"{currentType.nomType}"</strong> ?
              <br />
              Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border rounded-2xl"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl"
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
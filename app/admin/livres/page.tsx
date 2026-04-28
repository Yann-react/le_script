'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';

interface Livre {
  id: number;
  nom: string;
  auteur: string;
  prix: number;
  urlImage?: string;
  typeId: number;
  type?: { nomType: string };
}

interface TypeLivre {
  id: number;
  nomType: string;
}

export default function AdminLivres() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [types, setTypes] = useState<TypeLivre[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour recherche et modals
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLivres, setFilteredLivres] = useState<Livre[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentLivre, setCurrentLivre] = useState<Livre | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    auteur: '',
    prix: 0,
    typeId: 0,
  });

  // Récupérer données
  const fetchData = async () => {
    try {
      const [livresRes, typesRes] = await Promise.all([
        fetch('http://localhost:3005/livres'),
        fetch('http://localhost:3005/types-livre')
      ]);
      
      const livresData = await livresRes.json();
      const typesData = await typesRes.json();

      setLivres(livresData);
      setTypes(typesData);
      setFilteredLivres(livresData);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrage en temps réel
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLivres(livres);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = livres.filter(livre =>
      livre.nom.toLowerCase().includes(term) || 
      livre.auteur.toLowerCase().includes(term)
    );
    setFilteredLivres(filtered);
  }, [searchTerm, livres]);

  // Ouvrir modal Ajout
  const openAddModal = () => {
    setFormData({ nom: '', auteur: '', prix: 0, typeId: 0 });
    setImageFile(null);
    setShowAddModal(true);
  };

  // Ouvrir modal Modification
  const openEditModal = (livre: Livre) => {
    setCurrentLivre(livre);
    setFormData({
      nom: livre.nom,
      auteur: livre.auteur,
      prix: livre.prix,
      typeId: livre.typeId || 0,
    });
    setImageFile(null);
    setShowEditModal(true);
  };

  // Soumission (Ajout ou Modification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Vous devez être connecté pour effectuer cette action");
      return;
    }

    const form = new FormData();
    form.append('nom', formData.nom);
    form.append('auteur', formData.auteur);
    form.append('prix', formData.prix.toString());
    form.append('typeId', formData.typeId.toString());
    
    if (imageFile) {
      form.append('image', imageFile);
    }

    try {
      const method = showEditModal ? 'PATCH' : 'POST';
      const url = showEditModal 
        ? `http://localhost:3005/livres/${currentLivre?.id}` 
        : 'http://localhost:3005/livres';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form,
      });

      if (res.ok) {
        setShowAddModal(false);
        setShowEditModal(false);
        setImageFile(null);
        fetchData();
        alert(showEditModal ? 'Livre modifié avec succès' : 'Livre ajouté avec succès');
      } else {
        alert('Erreur lors de l\'opération');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur de connexion au serveur');
    }
  };

  // Suppression
  const handleDelete = async () => {
    if (!currentLivre) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3005/livres/${currentLivre.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setLivres(livres.filter(l => l.id !== currentLivre.id));
        setFilteredLivres(filteredLivres.filter(l => l.id !== currentLivre.id));
        setShowDeleteModal(false);
        setCurrentLivre(null);
        alert('Livre supprimé avec succès');
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
        <h1 className="text-3xl font-bold text-[#0B1C40]">Gestion des Livres</h1>
        
        <div className="flex items-center gap-4">
          {/* Barre de recherche */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-red-600"
            />
          </div>

          <button 
            onClick={openAddModal}
            className="bg-[#BF0F0F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-red-700 transition"
          >
            <Plus size={20} />
            Ajouter un livre
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Titre</th>
              <th className="px-6 py-4 text-left">Auteur</th>
              <th className="px-6 py-4 text-left">Prix (FCFA)</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLivres.map((livre) => (
              <tr key={livre.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img 
                    src={livre.urlImage || "/livre.png"} 
                    alt={livre.nom} 
                    className="w-14 h-14 object-cover rounded-lg" 
                  />
                </td>
                <td className="px-6 py-4 font-medium">{livre.nom}</td>
                <td className="px-6 py-4 text-gray-600">{livre.auteur}</td>
                <td className="px-6 py-4 font-semibold text-[#BF0F0F]">
                  {livre.prix.toLocaleString('fr-FR')} FCFA
                </td>
                <td className="px-6 py-4">{livre.type?.nomType || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => openEditModal(livre)}
                      className="text-blue-600 hover:text-blue-700 transition"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentLivre(livre);
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
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0B1C40]">
                    {showAddModal ? 'Ajouter un livre' : 'Modifier le livre'}
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
                    <label className="block text-sm font-medium mb-1">Titre du livre</label>
                    <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-4 py-3 border rounded-2xl"
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Auteur</label>
                    <input
                    type="text"
                    value={formData.auteur}
                    onChange={(e) => setFormData({...formData, auteur: e.target.value})}
                    className="w-full px-4 py-3 border rounded-2xl"
                    required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
                    <input
                        type="number"
                        value={formData.prix}
                        onChange={(e) => setFormData({...formData, prix: parseFloat(e.target.value)})}
                        className="w-full px-4 py-3 border rounded-2xl"
                        required
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                        value={formData.typeId}
                        onChange={(e) => setFormData({...formData, typeId: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border rounded-2xl"
                        required
                    >
                        <option value="">Sélectionner un type</option>
                        {types.map(t => (
                        <option key={t.id} value={t.id}>{t.nomType}</option>
                        ))}
                    </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Image du livre</label>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3"
                    />
                    <p className="text-xs text-gray-500 mt-1">Laissez vide pour garder l'image actuelle (en modification)</p>
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
                    {showAddModal ? 'Ajouter le livre' : 'Modifier le livre'}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}

        {/* Modal Suppression */}
        {showDeleteModal && currentLivre && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
                <p className="text-gray-600 mb-6">
                Voulez-vous vraiment supprimer le livre <strong>"{currentLivre.nom}"</strong> ?
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
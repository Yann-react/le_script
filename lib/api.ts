const API_BASE_URL = 'http://localhost:3005';

export const api = {
  // Récupérer tous les livres (avec recherche possible)
  getBooks: async (params?: {
    nom?: string;
    auteur?: string;
    typeId?: number;
    prixMin?: number;
    prixMax?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.nom) query.append('nom', params.nom);
    if (params?.auteur) query.append('auteur', params.auteur);
    if (params?.typeId) query.append('typeId', params.typeId.toString());
    if (params?.prixMin) query.append('prixMin', params.prixMin.toString());
    if (params?.prixMax) query.append('prixMax', params.prixMax.toString());

    const res = await fetch(`${API_BASE_URL}/livres?${query.toString()}`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des livres');
    return res.json();
  },

  // Récupérer un livre par ID
  getBookById: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/livres/${id}`);
    if (!res.ok) throw new Error('Livre non trouvé');
    return res.json();
  },

  // Récupérer tous les types de livres
  getTypes: async () => {
    const res = await fetch(`${API_BASE_URL}/types-livre`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des types');
    return res.json();
  },
};
'use client';

import { useEffect, useState, useRef } from 'react';
import Header from "@/Components/layout/Header";
import Hero from "@/Components/hero/Hero";
import BooksCarousel from "@/Components/BooksCarousel";
import Footer from "@/Components/layout/Footer";
import BookCard from '@/Components/BookCard';

const API_BASE_URL = 'http://localhost:3005';
const ITEMS_PER_PAGE = 10;

interface Book {
  id: number;
  nom: string;
  auteur: string;
  prix: number;
  urlImage?: string;
  type?: { nomType: string };
  dateAjout?: string;
  statut: string;
}

interface TypeLivre {
  id: number;
  nomType: string;
}

export default function Home() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [types, setTypes] = useState<TypeLivre[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState(100000);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const [currentPage, setCurrentPage] = useState(1);

  const carouselRef = useRef<HTMLDivElement>(null);
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, typesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/livres`),
          fetch(`${API_BASE_URL}/types-livre`)
        ]);

        const booksData: Book[] = await booksRes.json();
        const typesData: TypeLivre[] = await typesRes.json();

        // Filtrer uniquement les livres DISPONIBLE pour le client
        const availableBooks = booksData.filter(book => book.statut === 'DISPONIBLE');

        setAllBooks(availableBooks);
        setTypes(typesData);

        if (availableBooks.length > 0) {
          const prices = availableBooks.map(b => b.prix);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setMinPrice(min);
          setMaxPrice(max);
          setPriceRange(max);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrage + Pagination
  useEffect(() => {
    let result = [...allBooks];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book =>
        book.nom.toLowerCase().includes(term) || 
        book.auteur.toLowerCase().includes(term)
      );
    }

    if (selectedType) {
      result = result.filter(book => book.type?.nomType === selectedType);
    }

    result = result.filter(book => book.prix <= priceRange);

    setFilteredBooks(result);
    setCurrentPage(1); // Reset à la première page quand on filtre
  }, [allBooks, searchTerm, selectedType, priceRange]);

  console.log("first",allBooks)
  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Nouveaux articles (moins d'1 mois + statut DISPONIBLE)
  const newBooksForCarousel = allBooks
    .filter(book => {
      if (!book.dateAjout) return false;
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(book.dateAjout) >= oneMonthAgo;
    })
    .sort((a, b) => new Date(b.dateAjout!).getTime() - new Date(a.dateAjout!).getTime())
    .slice(0, 8)
    .map(book => ({
      id: book.id,
      image: book.urlImage || "/livre.png",
      author: book.auteur,
      title: book.nom,
      price: book.prix,
      rating: 4.5,
    }));

  const handleHeroSearch = (term: string, type: string) => {
    setSearchTerm(term);
    setSelectedType(type);
    setTimeout(() => {
      articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const scrollToSection = (section: string) => {
    if (section === 'Accueil') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (section === 'Nouveau ouvrage') carouselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (section === 'Article') articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Chargement des livres...</div>;
  }

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <Header onNavigate={scrollToSection} />

      <Hero onSearch={handleHeroSearch} />

      {/* Section Nouveaux Articles */}
      <div ref={carouselRef}>
        <BooksCarousel books={newBooksForCarousel} title="Nouveaux Articles" />
      </div>

      {/* Section Articles avec Pagination */}
      <section ref={articlesSectionRef} className="relative max-w-7xl mx-auto px-6 py-16 scroll-mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold" style={{ color: '#BF0F0F' }}>
            Tous les Articles
          </h2>
          <p className="text-gray-500">
            {filteredBooks.length} livre{filteredBooks.length > 1 ? 's' : ''} trouvé{filteredBooks.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtre */}
        <div className="rounded-[32px] bg-[#0B1C40] p-6 text-white shadow-lg mb-10">
          <div className="grid gap-6 lg:grid-cols-3 items-end">
            <div className="space-y-4">
              <label className="block text-sm font-semibold">
                Prix maximum : {priceRange.toLocaleString('fr-FR')} FCFA
              </label>
              <input 
                type="range" 
                min={minPrice} 
                max={maxPrice} 
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-white" 
              />
              <div className="flex justify-between text-xs text-white/80">
                <span>{minPrice.toLocaleString('fr-FR')} FCFA</span>
                <span>{maxPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold">Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white outline-none focus:border-white appearance-none"
              >
                <option value="">Tous les types</option>
                {types.map((type) => (
                  <option key={type.id} value={type.nomType} className="text-black bg-white">
                    {type.nomType}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold">Recherche</label>
              <input
                type="text"
                placeholder="Nom ou auteur"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Résultats avec Pagination */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map((book) => (
              <BookCard 
                key={book.id}
                id={book.id}
                image={book.urlImage || "/livre.png"}
                author={book.auteur}
                title={book.nom}
                price={book.prix}
                rating={4.5}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">
              Aucun livre disponible avec ces critères.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-xl disabled:opacity-50"
            >
              Précédent
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-xl ${currentPage === page 
                  ? 'bg-[#BF0F0F] text-white' 
                  : 'border hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-xl disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
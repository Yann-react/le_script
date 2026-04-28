'use client';

import { useEffect, useState, useRef } from 'react';
import Header from "@/Components/layout/Header";
import Hero from "@/Components/hero/Hero";
import BooksCarousel from "@/Components/BooksCarousel";
import Footer from "@/Components/layout/Footer";
import BookCard from '@/Components/BookCard';

const API_BASE_URL = 'http://localhost:3005';

interface Book {
  id: number;
  nom: string;
  auteur: string;
  prix: number;
  urlImage?: string;
  type?: { nomType: string };
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
  const [priceRange, setPriceRange] = useState(100);

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

        setAllBooks(booksData);
        setFilteredBooks(booksData);
        setTypes(typesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrage
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
  }, [allBooks, searchTerm, selectedType, priceRange]);

  const handleHeroSearch = (term: string, type: string) => {
    setSearchTerm(term);
    setSelectedType(type);

    setTimeout(() => {
      articlesSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 150);
  };

  // Navigation depuis le Header
  const scrollToSection = (section: string) => {
    if (section === 'Accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'Nouveau ouvrage') {
      carouselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'Article') {
      articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Chargement des livres...</div>;
  }

const newBooksForCarousel = allBooks
  .sort((a, b) => b.id - a.id)
  .slice(0, 6)
  .map(book => ({
    id: book.id,                    // ← Ajoute l'id
    image: book.urlImage || "/livre.png",
    author: book.auteur,
    title: book.nom,
    price: book.prix,
    rating: 4.5,
  }));

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <Header onNavigate={scrollToSection} />

      <Hero onSearch={handleHeroSearch} />

      {/* Section Nouveaux Articles */}
      <div ref={carouselRef}>
        <BooksCarousel books={newBooksForCarousel} title="Nouveaux Articles" />
      </div>

      {/* Section Articles */}
      <section ref={articlesSectionRef} className="relative max-w-7xl mx-auto px-6 py-16 scroll-mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold" style={{ color: '#BF0F0F' }}>
            Articles
          </h2>
        </div>

        {/* Filtre */}
        <div className="rounded-[32px] bg-[#0B1C40] p-6 text-white shadow-lg">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr] xl:grid-cols-[1.2fr_0.9fr_1.2fr] items-center">
            
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Prix max : {priceRange}€</label>
              <div className="space-y-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-white" 
                />
                <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  <span>0€</span>
                  <span>100€</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold">Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white shadow-sm outline-none focus:border-white appearance-none"
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
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white shadow-sm outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard 
                key={book.id}
                image={book.urlImage || "/livre.png"}
                author={book.auteur}
                title={book.nom}
                price={book.prix}
                rating={4.5}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">
              Aucun livre trouvé avec ces critères.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
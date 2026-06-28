'use client';

import { useEffect, useState, useRef } from 'react';
import Header from "@/Components/layout/Header";
import Hero from "@/Components/hero/Hero";
import BooksCarousel from "@/Components/BooksCarousel";
import Footer from "@/Components/layout/Footer";
import BookCard from '@/Components/BookCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ITEMS_PER_PAGE = 10;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
interface Book {
  id: number; // Modifié ici : string -> number
  nom: string;
  auteur: string;
  prix: number;
  urlImage?: string;
  type?: { nomType: string };
  dateAjout?: string;
  statut: string;
}

interface TypeLivre {
  id: number; // Modifié ici : string -> number
  nomType: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache module-level
const cache = {} as {
  books?: CacheEntry<Book[]>;
  types?: CacheEntry<TypeLivre[]>;
};

function isFresh<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

async function fetchWithCache<T extends Book[] | TypeLivre[]>(
  key: 'books' | 'types',
  url: string
): Promise<T> {
  const entry = cache[key] as CacheEntry<T> | undefined;
  if (isFresh(entry)) return entry.data;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
  const data: T = await res.json();
  (cache as Record<string, CacheEntry<T>>)[key] = { data, timestamp: Date.now() };
  return data;
}

// Skeleton d'une carte livre
function BookCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="rounded-3xl bg-gray-200 w-full aspect-[3/4]" />
      <div className="mt-4 space-y-2 text-center">
        <div className="h-3 bg-gray-200 rounded-full w-2/3 mx-auto" />
        <div className="h-4 bg-gray-200 rounded-full w-4/5 mx-auto" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-5 bg-gray-200 rounded-full w-1/3" />
        <div className="h-4 bg-gray-200 rounded-full w-1/4" />
      </div>
    </div>
  );
}

export default function Home() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [types, setTypes] = useState<TypeLivre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState(100000);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [currentPage, setCurrentPage] = useState(1);

  const carouselRef = useRef<HTMLDivElement>(null);
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, typesData] = await Promise.all([
          fetchWithCache<Book[]>('books', `${API_BASE_URL}/livres`),
          fetchWithCache<TypeLivre[]>('types', `${API_BASE_URL}/types-livre`),
        ]);

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
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Impossible de charger les livres. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    setCurrentPage(1);
  }, [allBooks, searchTerm, selectedType, priceRange]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <Header onNavigate={scrollToSection} />
      <Hero onSearch={handleHeroSearch} types={types} />

      <div ref={carouselRef}>
        {loading ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            <div className="h-8 bg-gray-200 rounded-full w-48 mb-8 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />)}
            </div>
          </section>
        ) : (
          <BooksCarousel books={newBooksForCarousel} title="Nouveaux Articles" />
        )}
      </div>

      <section ref={articlesSectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 scroll-mt-24">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold" style={{ color: '#BF0F0F' }}>
            Tous les Articles
          </h2>
          {!loading && !error && (
            <p className="text-sm text-gray-500">
              {filteredBooks.length} livre{filteredBooks.length > 1 ? 's' : ''} trouvé{filteredBooks.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filtre */}
        <div className="rounded-[24px] sm:rounded-[32px] bg-[#0B1C40] p-4 sm:p-6 text-white shadow-lg mb-8 sm:mb-10">
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:items-end">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Prix max : {priceRange.toLocaleString('fr-FR')} FCFA
              </label>
              <input type="range" min={minPrice} max={maxPrice} value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-white" />
              <div className="flex justify-between text-xs text-white/70">
                <span>{minPrice.toLocaleString('fr-FR')} FCFA</span>
                <span>{maxPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white outline-none focus:border-white appearance-none">
                <option value="">Tous les types</option>
                {types.map((type) => (
                  <option key={type.id} value={type.nomType} className="text-black bg-white">{type.nomType}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Recherche</label>
              <input type="text" placeholder="Nom ou auteur" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white outline-none focus:border-white" />
            </div>
          </div>
        </div>

        {/* États : erreur / skeleton / résultats */}
        {error ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => { cache.books = undefined; cache.types = undefined; window.location.reload(); }}
              className="px-6 py-2 rounded-xl text-white text-sm"
              style={{ backgroundColor: '#BF0F0F' }}
            >
              Réessayer
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedBooks.length > 0 ? (
                paginatedBooks.map((book) => (
                  <BookCard key={book.id} id={book.id}
                    image={book.urlImage || "/livre.png"}
                    author={book.auteur} title={book.nom}
                    price={book.prix} rating={4.5} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-10">
                  Aucun livre disponible avec ces critères.
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center mt-10 gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 border rounded-xl text-sm disabled:opacity-50">
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-sm ${currentPage === page ? 'bg-[#BF0F0F] text-white' : 'border hover:bg-gray-100'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 border rounded-xl text-sm disabled:opacity-50">
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}
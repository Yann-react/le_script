'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import BooksCarousel from "@/Components/BooksCarousel";
import { Star } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const res = await fetch(`${API_BASE_URL}/livres/${params.id}`);
  const livre = await res.json();

  return {
    title: livre.nom,
    description: livre.description ?? `${livre.nom} par ${livre.auteur}`,
    openGraph: {
      title: livre.nom,
      description: livre.description ?? `${livre.nom} par ${livre.auteur}`,
      images: livre.urlImage ? [{ url: livre.urlImage }] : [],
    },
  };
}
interface Book {
  id: number; // Modifié ici : string -> number
  nom: string;
  auteur: string;
  description?: string;
  prix: number;
  urlImage?: string;
  typeId?: number; // Modifié ici : string -> number
  type?: { nomType: string };
  statut?: string;
}

interface Avis {
  id: number;
  nom: string;
  commentaire: string;
  notation: number;
  dateAvis: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache partagé avec la home (même module)
const cache: {
  books?: CacheEntry<Book[]>;
  book?: Record<number, CacheEntry<Book>>; // Modifié ici : Record<string, ...> -> Record<number, ...>
} = {};

function isFresh<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

async function fetchBook(id: number): Promise<Book> { // Modifié ici : id: string -> number
  if (!cache.book) cache.book = {};
  if (isFresh(cache.book[id])) return cache.book[id].data;

  const res = await fetch(`${API_BASE_URL}/livres/${id}`);
  if (!res.ok) throw new Error("Livre non trouvé");
  const data: Book = await res.json();
  cache.book[id] = { data, timestamp: Date.now() };
  return data;
}

async function fetchAllBooks(): Promise<Book[]> {
  if (isFresh(cache.books)) return cache.books.data;
  const res = await fetch(`${API_BASE_URL}/livres`);
  if (!res.ok) throw new Error("Erreur chargement livres");
  const data: Book[] = await res.json();
  cache.books = { data, timestamp: Date.now() };
  return data;
}

// Skeletons
function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-5 bg-gray-200 rounded-full w-32 mb-8" />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="rounded-[40px] bg-gray-200 aspect-square w-full" />
        <div className="space-y-5 pt-4">
          <div className="h-10 bg-gray-200 rounded-full w-3/4" />
          <div className="h-6 bg-gray-200 rounded-full w-1/2" />
          <div className="h-8 bg-gray-200 rounded-full w-1/3" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-gray-200 rounded-full w-full" />
            <div className="h-4 bg-gray-200 rounded-full w-5/6" />
            <div className="h-4 bg-gray-200 rounded-full w-4/6" />
          </div>
          <div className="h-12 bg-gray-200 rounded-xl w-56 mt-8" />
        </div>
      </div>
    </div>
  );
}

export default function DetailProduct() {
  const params = useParams();
  const bookId = params?.id ? Number(params.id) : null; // Modifié ici pour récupérer un number ou null
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [nom, setNom] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [notation, setNotation] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (bookId === null || isNaN(bookId)) return; // Protection si l'ID n'est pas un nombre valide

    const fetchData = async () => {
      try {
        // Livre + avis en parallèle
        const [bookData, avisRes] = await Promise.all([
          fetchBook(bookId),
          fetch(`${API_BASE_URL}/avis/livre/${bookId}`),
        ]);

        const avisData: Avis[] = avisRes.ok ? await avisRes.json() : [];

        // Livres similaires : on pioche dans le cache global si dispo
        let relatedData: Book[] = [];
        if (bookData.typeId) {
          try {
            const allBooks = await fetchAllBooks();
            relatedData = allBooks
              .filter(b => b.id !== bookData.id && b.typeId === bookData.typeId && b.statut === 'DISPONIBLE')
              .slice(0, 6);
          } catch {
            // pas bloquant
          }
        }

        setBook(bookData);
        setAvis(avisData);
        setRelatedBooks(relatedData);
      } catch (error) {
        console.error("Erreur chargement livre:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  const handleSubmitAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !commentaire || bookId === null) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/avis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, commentaire, notation, livreId: bookId }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setNom('');
        setCommentaire('');
        setNotation(5);

        // Rafraîchir les avis (pas de cache ici, données live)
        const avisRes = await fetch(`${API_BASE_URL}/avis/livre/${bookId}`);
        if (avisRes.ok) setAvis(await avisRes.json());

        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        alert("Erreur lors de l'envoi de l'avis");
      }
    } catch {
      alert("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = avis.length > 0
    ? (avis.reduce((sum, a) => sum + a.notation, 0) / avis.length).toFixed(1)
    : "0.0";

  if (notFound) {
    return (
      <>
        <Header onNavigate={(path) => router.push(path)} />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-xl text-gray-500">Livre introuvable.</p>
          <Link href="/" className="px-6 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: '#BF0F0F' }}>
            Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header onNavigate={(path) => router.push(path)} />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">

          <Link href="/" className="mb-8 inline-flex items-center text-sm font-semibold text-[#0B1C40]">
            ← Retour à l'accueil
          </Link>

          {loading ? <DetailSkeleton /> : (
            <>
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
                <div className="overflow-hidden rounded-[40px] bg-[#F8FAFC] shadow-2xl">
                  <Image
                    src={book!.urlImage || "/livre.png"}
                    alt={book!.nom}
                    width={900}
                    height={900}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-black leading-tight" style={{ color: '#0B1C40' }}>
                      {book!.nom}
                    </h1>
                    <p className="text-lg sm:text-xl font-normal" style={{ color: '#0B1C40' }}>
                      {book!.auteur}
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#BF0F0F' }}>
                      {book!.prix.toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="max-w-xl text-base leading-8" style={{ color: '#0B1C40' }}>
                      {book!.description || "Un chef-d'œuvre de la littérature classique."}
                    </p>
                  </div>

                  <div className="mt-auto flex justify-start">
                    <button
                      onClick={() => {
                        const message = `Bonjour,%0AJe suis intéressé(e) par le livre *${book!.nom}* de ${book!.auteur}.%0A%0APouvez-vous me confirmer le prix *${book!.prix.toLocaleString('fr-FR')}* FCFA et la disponibilité ?%0A%0AMerci !`;
                        window.open(`https://wa.me/2250747827206?text=${message}`, '_blank');
                      }}
                      className="rounded-xl bg-[#25D366] hover:bg-[#128C7E] px-8 sm:px-10 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition flex items-center gap-3"
                    >
                      Commander via WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Avis */}
              <section className="mt-16 sm:mt-24 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-[#0B1C40]">Nombre d'avis</p>
                      <p className="mt-3 text-4xl font-bold" style={{ color: '#0B1C40' }}>{avis.length}</p>
                    </div>
                    <div className="rounded-3xl border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-[#0B1C40]">Note moyenne</p>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-4xl font-bold" style={{ color: '#BF0F0F' }}>{averageRating}</p>
                        <Star className="fill-current text-[#BF0F0F]" size={32} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-[32px] border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                    <h2 className="text-2xl font-bold" style={{ color: '#0B1C40' }}>Commentaires récents</h2>
                    <div className="space-y-4">
                      {avis.length > 0 ? avis.slice(0, 3).map((review) => (
                        <div key={review.id} className="rounded-3xl bg-white p-5 shadow-sm">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-[#0B1C40]">{review.nom}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(review.dateAvis).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex text-[#BF0F0F]">
                              {Array.from({ length: review.notation }).map((_, i) => (
                                <Star key={i} size={16} className="fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-700">{review.commentaire}</p>
                        </div>
                      )) : (
                        <p className="text-gray-500">Aucun avis pour le moment.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Formulaire avis */}
                <div className="rounded-[32px] border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                  <h3 className="text-xl font-bold mb-6" style={{ color: '#0B1C40' }}>Laissez votre avis</h3>

                  {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-2xl text-sm">
                      Merci ! Votre avis a été publié avec succès.
                    </div>
                  )}

                  <form onSubmit={handleSubmitAvis} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-[#0B1C40]/20 bg-white px-4 py-3 outline-none"
                    />
                    <textarea
                      placeholder="Votre commentaire"
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      required
                      className="w-full min-h-[140px] rounded-2xl border border-[#0B1C40]/20 bg-white px-4 py-3 outline-none"
                    />
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0B1C40]">Votre note</label>
                      <div className="flex gap-1 cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={32}
                            className={`transition-colors ${star <= notation ? 'fill-current text-[#BF0F0F]' : 'text-gray-300'}`}
                            onClick={() => setNotation(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-2xl bg-[#0B1C40] py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:opacity-70"
                    >
                      {submitting ? "Envoi en cours..." : "Publier mon avis"}
                    </button>
                  </form>
                </div>
              </section>

              {relatedBooks.length > 0 && (
                <section className="mt-16 sm:mt-24">
                  <BooksCarousel
                    books={relatedBooks.map(b => ({
                      id: b.id,
                      image: b.urlImage || "/livre.png",
                      author: b.auteur,
                      title: b.nom,
                      price: b.prix,
                      rating: 4.5,
                    }))}
                    title="Livres similaires"
                  />
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

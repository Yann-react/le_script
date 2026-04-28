'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import BooksCarousel from "@/Components/BooksCarousel";
import { Star } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3005';

interface Book {
  id: number;
  nom: string;
  auteur: string;
  description?: string;
  prix: number;
  urlImage?: string;
  typeId?: number;
  type?: { nomType: string };
}

interface Avis {
  id: number;
  nom: string;
  commentaire: string;
  notation: number;
  dateAvis: string;
}

export default function DetailProduct() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour le formulaire d'avis
  const [nom, setNom] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [notation, setNotation] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetail = async () => {
      try {
        const bookRes = await fetch(`${API_BASE_URL}/livres/${bookId}`);
        if (!bookRes.ok) throw new Error("Livre non trouvé");
        const bookData = await bookRes.json();

        const avisRes = await fetch(`${API_BASE_URL}/avis/livre/${bookId}`);
        const avisData = await avisRes.json();

        let relatedData: Book[] = [];
        if (bookData.typeId) {
          const relatedRes = await fetch(`${API_BASE_URL}/livres?typeId=${bookData.typeId}`);
          if (relatedRes.ok) {
            relatedData = await relatedRes.json();
            relatedData = relatedData.filter((b: Book) => b.id !== bookData.id).slice(0, 6);
          }
        }

        setBook(bookData);
        setAvis(avisData);
        setRelatedBooks(relatedData);
      } catch (error) {
        console.error("Erreur lors du chargement du livre:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId]);

  // Soumission du formulaire d'avis
  const handleSubmitAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !commentaire) return;

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/avis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          commentaire,
          notation,
          livreId: parseInt(bookId),
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setNom('');
        setCommentaire('');
        setNotation(5);

        // Rafraîchir les avis
        const avisRes = await fetch(`${API_BASE_URL}/avis/livre/${bookId}`);
        const newAvis = await avisRes.json();
        setAvis(newAvis);

        // Masquer le message de succès après 3 secondes
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        alert("Erreur lors de l'envoi de l'avis");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Chargement du livre...</div>;
  }

  if (!book) {
    return <div className="min-h-screen flex items-center justify-center">Livre non trouvé</div>;
  }

  const averageRating = avis.length > 0 
    ? (avis.reduce((sum, a) => sum + a.notation, 0) / avis.length).toFixed(1) 
    : "0.0";

  const reviewBreakdown = [
    { stars: 5, count: avis.filter(a => a.notation === 5).length, percent: 55 },
    { stars: 4, count: avis.filter(a => a.notation === 4).length, percent: 24 },
    { stars: 3, count: avis.filter(a => a.notation === 3).length, percent: 10 },
    { stars: 2, count: avis.filter(a => a.notation === 2).length, percent: 5 },
    { stars: 1, count: avis.filter(a => a.notation === 1).length, percent: 6 },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          
          <Link href="/" className="mb-8 inline-flex items-center text-sm font-semibold text-[#0B1C40]">
            ← Retour à l'accueil
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="overflow-hidden rounded-[40px] bg-[#F8FAFC] shadow-2xl">
              <Image
                src={book.urlImage || "/livre.png"}
                alt={book.nom}
                width={900}
                height={900}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            <div className="flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-tight" style={{ color: '#0B1C40' }}>
                  {book.nom}
                </h1>
                <p className="text-xl font-normal" style={{ color: '#0B1C40' }}>
                  {book.auteur}
                </p>
                <p className="text-4xl font-bold" style={{ color: '#BF0F0F' }}>
                  ${book.prix.toFixed(2)}
                </p>
                <p className="max-w-xl text-base leading-8" style={{ color: '#0B1C40' }}>
                  {book.description || "Un chef-d'œuvre de la littérature classique."}
                </p>
              </div>

              {/* Bouton Commander via WhatsApp */}
              <div className="mt-auto flex justify-start">
                <button 
                  onClick={() => {
                    const message = `Bonjour,%0AJe suis intéressé(e) par le livre *${book.nom}* de ${book.auteur}.%0A%0APouvez-vous me confirmer le prix et la disponibilité ?%0A%0AMerci !`;
                    const whatsappUrl = `https://wa.me/2250767571379?text=${message}`; // ← Change le numéro
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="rounded-xl bg-[#25D366] hover:bg-[#128C7E] px-10 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition flex items-center gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  Commander via WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Section Stats + Avis */}
          <section className="mt-24 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#0B1C40]">Nombre d'avis</p>
                  <p className="mt-3 text-4xl font-bold" style={{ color: '#0B1C40' }}>
                    {avis.length}
                  </p>
                </div>
                <div className="rounded-3xl border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#0B1C40]">Note moyenne</p>
                  <div className="mt-3 flex items-center gap-2">
                    <p className="text-4xl font-bold" style={{ color: '#BF0F0F' }}>
                      {averageRating}
                    </p>
                    <Star className="fill-current text-[#BF0F0F]" size={32} />
                  </div>
                </div>
              </div>

              {/* Classement des notes */}
              <div className="rounded-[32px] border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                <h2 className="text-2xl font-bold" style={{ color: '#0B1C40' }}>
                  Classement des notes
                </h2>
                <div className="mt-6 space-y-4">
                  {reviewBreakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-4">
                      <span className="w-10 text-sm font-semibold text-[#0B1C40]">{item.stars}★</span>
                      <div className="flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-3 rounded-full bg-[#BF0F0F]" style={{ width: `${item.percent}%` }} />
                      </div>
                      <span className="w-12 text-right text-sm text-slate-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commentaires récents */}
              <div className="space-y-4 rounded-[32px] border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                <h2 className="text-2xl font-bold" style={{ color: '#0B1C40' }}>
                  Commentaires récents
                </h2>
                <div className="space-y-4">
                  {avis.length > 0 ? (
                    avis.slice(0, 3).map((review) => (
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
                              <Star key={i} size={20} className="fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">{review.commentaire}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Aucun avis pour le moment.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Formulaire d'avis fonctionnel */}
            <div className="rounded-[32px] border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
              <h3 className="text-xl font-bold mb-6" style={{ color: '#0B1C40' }}>
                Laissez votre avis
              </h3>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-2xl">
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

                {/* Sélection d'étoiles interactive */}
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

          {/* Livres similaires */}
          {relatedBooks.length > 0 && (
            <section className="mt-24">
              <BooksCarousel 
                books={relatedBooks.map(b => ({
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
        </div>
      </main>
      <Footer />
    </>
  );
}
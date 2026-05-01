'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const bookIdString = params?.id as string;

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
    if (!bookIdString) return;

    const numericId = parseInt(bookIdString);

    // Vérification si l'ID est valide
    if (isNaN(numericId)) {
      console.error("ID invalide :", bookIdString);
      setLoading(false);
      return;
    }

    const fetchBookDetail = async () => {
      try {
        // Récupérer le livre
        const bookRes = await fetch(`${API_BASE_URL}/livres/${numericId}`);
        if (!bookRes.ok) throw new Error("Livre non trouvé");
        const bookData = await bookRes.json();

        // Récupérer les avis du livre
        const avisRes = await fetch(`${API_BASE_URL}/avis/livre/${numericId}`);
        const avisData = await avisRes.json();

        // Récupérer les livres similaires (même type)
        let relatedData: Book[] = [];
        if (bookData.typeId) {
          const relatedRes = await fetch(`${API_BASE_URL}/livres?typeId=${bookData.typeId}`);
          if (relatedRes.ok) {
            relatedData = await relatedRes.json();
            // Exclure le livre actuel et limiter à 6
            relatedData = relatedData
              .filter((b: Book) => b.id !== bookData.id)
              .slice(0, 6);
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
  }, [bookIdString]);

  // Soumission du formulaire d'avis
  const handleSubmitAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !commentaire || !bookIdString) return;

    const numericId = parseInt(bookIdString);
    if (isNaN(numericId)) return;

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/avis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          commentaire,
          notation,
          livreId: numericId,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setNom('');
        setCommentaire('');
        setNotation(5);

        // Rafraîchir les avis
        const avisRes = await fetch(`${API_BASE_URL}/avis/livre/${numericId}`);
        const newAvis = await avisRes.json();
        setAvis(newAvis);

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
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Chargement du livre...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Livre non trouvé
      </div>
    );
  }

  const averageRating = avis.length > 0 
    ? (avis.reduce((sum, a) => sum + a.notation, 0) / avis.length).toFixed(1) 
    : "0.0";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          
          <Link href="/" className="mb-8 inline-flex items-center text-sm font-semibold text-[#0B1C40]">
            ← Retour à l'accueil
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            {/* Image du livre */}
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

            {/* Informations du livre */}
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-tight" style={{ color: '#0B1C40' }}>
                  {book.nom}
                </h1>
                <p className="text-xl font-normal" style={{ color: '#0B1C40' }}>
                  {book.auteur}
                </p>
                <p className="text-4xl font-bold" style={{ color: '#BF0F0F' }}>
                  {book.prix.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="max-w-xl text-base leading-8" style={{ color: '#0B1C40' }}>
                  {book.description || "Un chef-d'œuvre de la littérature classique."}
                </p>
              </div>

              {/* Bouton WhatsApp */}
              <div className="mt-auto flex justify-start">
                <button 
                  onClick={() => {
                    const message = `Bonjour,%0AJe suis intéressé(e) par le livre *${book.nom}* de ${book.auteur}.%0A%0APouvez-vous me confirmer le prix et la disponibilité ?%0A%0AMerci !`;
                    window.open(`https://wa.me/2250767571379?text=${message}`, '_blank');
                  }}
                  className="rounded-xl bg-[#25D366] hover:bg-[#128C7E] px-10 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition flex items-center gap-3"
                >
                  Commander via WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Section Avis et Formulaire */}
          <section className="mt-24 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Stats + Commentaires */}
            <div className="space-y-6">
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

            {/* Formulaire pour laisser un avis */}
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
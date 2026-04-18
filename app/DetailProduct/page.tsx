import Image from "next/image";
import BooksCarousel from "@/Components/BooksCarousel";
import Link from "next/link";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";

export default function DetailProduct() {
  const relatedBooks = [
    {
      image: "/livre.png",
      author: "Victor Hugo",
      title: "Les Misérables",
      price: 14.99,
      rating: 5,
    },
    {
      image: "/livre.png",
      author: "Jules Verne",
      title: "Le Tour du Monde",
      price: 12.99,
      rating: 4.5,
    },
    {
      image: "/livre.png",
      author: "Alexandre Dumas",
      title: "Le Comte de Monte Cristo",
      price: 16.99,
      rating: 5,
    },
    {
      image: "/livre.png",
      author: "Gustave Flaubert",
      title: "Madame Bovary",
      price: 13.99,
      rating: 4,
    },
  ];

  const reviewBreakdown = [
    { stars: 5, count: 64, percent: 55 },
    { stars: 4, count: 28, percent: 24 },
    { stars: 3, count: 12, percent: 10 },
    { stars: 2, count: 6, percent: 5 },
    { stars: 1, count: 4, percent: 6 },
  ];

  const sampleComments = [
    {
      name: "Claire",
      date: "2 jours ago",
      rating: 5,
      text: "Une narration incroyable, j'ai adoré chaque page. Très bon équilibre entre suspense et émotion.",
    },
    {
      name: "Sébastien",
      date: "1 semaine ago",
      rating: 4,
      text: "Superbe ouvrage, juste un peu long sur la fin, mais le style reste captivant.",
    },
    {
      name: "Lea",
      date: "3 semaines ago",
      rating: 5,
      text: "Un classique plus moderne que jamais. Je recommande pour les lecteurs qui aiment les grandes sagas.",
    },
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
                src="/livre.png"
                alt="Détail du livre"
                width={900}
                height={900}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-tight" style={{ color: '#0B1C40' }}>
                  Le Comte de Monte Cristo
                </h1>
                <p className="text-xl font-normal" style={{ color: '#0B1C40' }}>
                  Alexandre Dumas
                </p>
                <p className="text-4xl font-bold" style={{ color: '#BF0F0F' }}>
                  $16.99
                </p>
                <p className="max-w-xl text-base leading-8" style={{ color: '#0B1C40' }}>
                  Un chef-d'œuvre de la littérature classique, où Edmond Dantès se transforme en comte pour se venger de ceux qui l'ont trahi. Une épopée de justice, de passion et de rédemption.
                </p>
              </div>

              <div className="mt-auto flex justify-start">
                <button className="rounded-xl bg-[#BF0F0F] px-10 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-red-800">
                  Commander
                </button>
              </div>
            </div>
          </div>

          <section className="mt-24 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#0B1C40]">Nombre d'avis</p>
                  <p className="mt-3 text-4xl font-bold" style={{ color: '#0B1C40' }}>
                    1,2k
                  </p>
                </div>
                <div className="rounded-3xl border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#0B1C40]">Note moyenne</p>
                  <p className="mt-3 text-4xl font-bold" style={{ color: '#BF0F0F' }}>
                    4.7⭐
                  </p>
                </div>
              </div>

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

              <div className="space-y-4 rounded-[32px] border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
                <h2 className="text-2xl font-bold" style={{ color: '#0B1C40' }}>
                  Commentaires récents
                </h2>
                <div className="space-y-4">
                  {sampleComments.map((comment) => (
                    <div key={comment.name} className="rounded-3xl bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#0B1C40]">{comment.name}</p>
                          <p className="text-xs text-slate-500">{comment.date}</p>
                        </div>
                        <span className="text-sm font-bold text-[#BF0F0F]">{comment.rating}⭐</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#0B1C40]/10 bg-[#F8FAFC] p-6">
              <h3 className="text-xl font-bold" style={{ color: '#0B1C40' }}>
                Laissez un avis
              </h3>
              <form className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Nom"
                  className="w-full rounded-2xl border border-[#0B1C40]/20 bg-white px-4 py-3 outline-none"
                />
                <textarea
                  placeholder="Votre commentaire"
                  className="w-full min-h-[140px] rounded-2xl border border-[#0B1C40]/20 bg-white px-4 py-3 outline-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#BF0F0F] text-lg">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <button type="submit" className="rounded-2xl bg-[#0B1C40] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white">
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="mt-24">
            <BooksCarousel books={relatedBooks} title="Autres Articles" />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

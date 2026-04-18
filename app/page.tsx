import Header from "@/Components/layout/Header";
import Hero from "@/Components/hero/Hero";
import BooksCarousel from "@/Components/BooksCarousel";
import Footer from "@/Components/layout/Footer";

export default function Home() {
  const newBooks = [
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
    {
      image: "/livre.png",
      author: "Honoré de Balzac",
      title: "Le Père Goriot",
      price: 15.99,
      rating: 4.5,
    },
    {
      image: "/livre.png",
      author: "Émile Zola",
      title: "L'Assommoir",
      price: 14.99,
      rating: 4,
    },
  ];

  const articleBooks = [
    {
      image: "/livre.png",
      author: "George Sand",
      title: "La Mare au Diable",
      price: 11.99,
      rating: 4,
    },
    {
      image: "/livre.png",
      author: "Alphonse Daudet",
      title: "Tartarin de Tarascon",
      price: 10.99,
      rating: 4.5,
    },
    {
      image: "/livre.png",
      author: "Paul Verlaine",
      title: "Fêtes galantes",
      price: 9.99,
      rating: 4,
    },
    {
      image: "/livre.png",
      author: "Arthur Rimbaud",
      title: "Une Saison en Enfer",
      price: 12.49,
      rating: 5,
    },
    {
      image: "/livre.png",
      author: "Stendhal",
      title: "Le Rouge et le Noir",
      price: 13.49,
      rating: 4.5,
    },
    {
      image: "/livre.png",
      author: "Charles Baudelaire",
      title: "Les Fleurs du mal",
      price: 14.49,
      rating: 5,
    },
    {
      image: "/livre.png",
      author: "Honoré de Balzac",
      title: "Eugénie Grandet",
      price: 12.99,
      rating: 4,
    },
    {
      image: "/livre.png",
      author: "Victor Hugo",
      title: "Notre-Dame de Paris",
      price: 15.49,
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <Header />
      <Hero />
      
      <BooksCarousel books={newBooks} title="Nouveaux Articles" />

      <section className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold" style={{ color: '#BF0F0F' }}>
            Articles
          </h2>
        </div>

        <div className="rounded-[32px] bg-[#0B1C40] p-6 text-white shadow-lg">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr] xl:grid-cols-[1.2fr_0.9fr_1.2fr] items-center">
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Prix</label>
              <div className="space-y-2">
                <input type="range" min="0" max="100" className="w-full accent-white" />
                <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  <span>0€</span>
                  <span>100€</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold">Type</label>
              <select className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white shadow-sm outline-none focus:border-white">
                <option className="bg-white text-[#0B1C40]">Roman</option>
                <option className="bg-white text-[#0B1C40]">Poésie</option>
                <option className="bg-white text-[#0B1C40]">Histoire</option>
                <option className="bg-white text-[#0B1C40]">Essai</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold">Recherche</label>
              <input
                type="text"
                placeholder="Nom ou auteur"
                className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white shadow-sm outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {articleBooks.map((book, index) => (
            <div key={index} className="rounded-3xl bg-white p-4 shadow-lg">
              <img src={book.image} alt={book.title} className="w-full h-64 object-cover rounded-3xl" />
              <div className="mt-5 text-center">
                <p className="text-sm text-[#0B1C40]">{book.author}</p>
                <p className="mt-1 text-base font-bold text-[#0B1C40]">{book.title}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#BF0F0F]">
                <span>${book.price.toFixed(2)}</span>
                <span>{'⭐'.repeat(Math.floor(book.rating))}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

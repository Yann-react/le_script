import Image from "next/image";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-red-200">
      <div className="absolute inset-0" style={{backgroundImage: 'url(/livre.png)', backgroundSize: 'contain', backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat', opacity: 0.4}}></div>
      <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-48">
        <div className="grid gap-10 lg:grid-cols-2 items-center relative z-10">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-red-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-700">
              Découverte littéraire
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl" style={{color: '#0B1C40'}}>
              Plongez dans votre prochaine <br className="hidden md:block" /> aventure littéraire
            </h1>

            <p className="max-w-xl text-base leading-8 sm:text-lg" style={{color: '#0B1C40'}}>
              Explorez notre plateforme et accédez à une sélection variée d’ouvrages adaptés à tous les goûts. Grâce à une navigation simple et intuitive, trouvez rapidement le livre qui correspond à vos envies du moment.
            </p>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl bg-red-700 px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              Découvrir
            </button>
          </div>

          <div className="space-y-6 md:pl-10" style={{color: '#0B1C40'}}>
            <p className="text-base leading-8">
              Envie d’une nouvelle découverte ? Explorez notre plateforme et accédez à une sélection variée d’ouvrages adaptés à tous les goûts.
            </p>
            <p className="text-base leading-8">
              Grâce à une navigation simple et intuitive, trouvez rapidement le livre qui correspond à vos envies du moment. Commencez dès maintenant votre prochaine aventure littéraire.
            </p>
          </div>
        </div>

      </div>

      <SearchBar />
    </section>
  );
}

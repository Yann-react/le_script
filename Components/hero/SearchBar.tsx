export default function SearchBar() {
  return (
    <form className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-slate-100/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-slate-200 z-30 flex flex-col gap-5 md:flex-row items-end">
      <div className="flex-1 min-w-0 space-y-2">
        <label htmlFor="search-type" className="block text-sm font-semibold text-slate-800">
          Type
        </label>
        <input
          id="search-type"
          name="type"
          type="text"
          placeholder="Roman, BD, essai..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <label htmlFor="search-title" className="block text-sm font-semibold text-slate-800">
          Titre
        </label>
        <input
          id="search-title"
          name="title"
          type="text"
          placeholder="L'alchimiste..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-2xl bg-red-700 px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-200"
      >
        Rechercher
      </button>
    </form>
  );
}

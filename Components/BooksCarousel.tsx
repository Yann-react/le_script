'use client';

import { useState } from 'react';
import BookCard from './BookCard';

interface Book {
  id: number;           // ← Ajoute cette ligne
  image: string;
  author: string;
  title: string;
  price: number;
  rating: number;
}

interface BooksCarouselProps {
  books: Book[];
  title: string;
}

export default function BooksCarousel({ books, title }: BooksCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const goNext = () => {
    if (currentIndex < books.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleBooks = books.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <h2 className="text-4xl font-bold" style={{ color: '#0B1C40' }}>
          {title}
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 z-10 flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-50"
          style={{ backgroundColor: '#BF0F0F' }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleBooks.map((book) => (
            <BookCard 
              key={book.id}           // ← Meilleure clé
              id={book.id}            // ← Passe l'id
              image={book.image}
              author={book.author}
              title={book.title}
              price={book.price}
              rating={book.rating}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex >= Math.max(books.length - itemsPerPage, 0)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 z-10 flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-50"
          style={{ backgroundColor: '#BF0F0F' }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
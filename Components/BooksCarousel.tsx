'use client';

import { useState } from 'react';
import BookCard from './BookCard';

interface Book {
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
  const maxIndex = Math.max(books.length - itemsPerPage, 0);
  const sliderValue = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 0;

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
          {visibleBooks.map((book, index) => (
            <BookCard key={currentIndex + index} {...book} />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 z-10 flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-50"
          style={{ backgroundColor: '#BF0F0F' }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {totalPages > 1 && (
        <div className="mt-12 px-4 flex justify-end">
          <div className="relative w-[280px] h-3 rounded-full bg-red-200/30 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#BF0F0F]"
              style={{ width: `${sliderValue}%` }}
            />
            <input
              type="range"
              min={0}
              max={maxIndex}
              value={currentIndex}
              onChange={(event) => setCurrentIndex(Number(event.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      )}
    </section>
  );
}

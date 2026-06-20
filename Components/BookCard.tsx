import Image from "next/image";
import Link from "next/link";
import { Star } from 'lucide-react';

interface BookCardProps {
  id: number;           // ← Très important à ajouter
  image: string;
  author: string;
  title: string;
  price: number;
  rating: number;
}

export default function BookCard({ 
  id, 
  image, 
  author, 
  title, 
  price, 
  rating 
}: BookCardProps) {
  const fullStars = Math.floor(rating);
  const decimalPart = rating % 1;

  return (
    <Link 
      href={"/livres/" + id} 
      className="group flex flex-col transition hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden rounded-3xl">
        <Image
          src={image}
          alt={title}
          width={250}
          height={350}
          className="w-full h-auto object-cover rounded-3xl transition-transform group-hover:scale-105"
        />
      </div>

      <div className="text-center mt-4">
        <p className="text-sm" style={{ color: '#0B1C40' }}>
          {author}
        </p>
        <p className="text-base font-bold mt-1" style={{ color: '#0B1C40' }}>
          {title}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-lg" style={{ color: '#BF0F0F' }}>
          {price.toFixed(2)} FCFA
        </span>

        {/* Étoiles avec Lucide */}
        <div className="flex items-center gap-0.5" style={{ color: '#BF0F0F' }}>
          {Array.from({ length: 5 }).map((_, index) => {
            if (index < fullStars) {
              return <Star key={index} size={20} className="fill-current" />;
            } else if (index === fullStars && decimalPart > 0) {
              return <Star key={index} size={20} className="fill-current opacity-70" />;
            } else {
              return <Star key={index} size={20} className="opacity-30" />;
            }
          })}
        </div>
      </div>
    </Link>
  );
}
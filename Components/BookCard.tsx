import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
  image: string;
  author: string;
  title: string;
  price: number;
  rating: number;
}

export default function BookCard({ image, author, title, price, rating }: BookCardProps) {
  return (
    <Link href="/DetailProduct" className="group flex flex-col transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative overflow-hidden rounded-3xl">
        <Image
          src={image}
          alt={title}
          width={250}
          height={350}
          className="w-full h-auto object-cover rounded-3xl"
        />
      </div>
      <div className="text-center mt-4">
        <p className="text-sm" style={{ color: '#0B1C40' }}>
          {author}
        </p>
        <p className="text-base font-bold" style={{ color: '#0B1C40' }}>
          {title}
        </p>
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="font-bold" style={{ color: '#BF0F0F' }}>
          ${price.toFixed(2)}
        </span>
        <div className="flex items-center gap-1" style={{ color: '#BF0F0F' }}>
          {'⭐'.repeat(Math.floor(rating))}
          {rating % 1 !== 0 && '⭐'}
        </div>
      </div>
    </Link>
  );
}

import { Metadata } from 'next';
import DetailProduct from './DetailProduct';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE_URL}/livres/${params.id}`);
    const livre = await res.json();
    return {
      title: livre.nom,
      description: livre.description ?? `${livre.nom} par ${livre.auteur}`,
      openGraph: {
        title: livre.nom,
        description: livre.description ?? `${livre.nom} par ${livre.auteur}`,
        images: livre.urlImage ? [{ url: livre.urlImage }] : [],
      },
    };
  } catch {
    return { title: 'Livre' };
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <DetailProduct />;
}
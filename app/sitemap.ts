import { MetadataRoute } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://lescripts.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://lescripts.com/livres',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Pages dynamiques (livres)
  try {
    const res = await fetch(`${API_BASE_URL}/livres`);
    const livres = await res.json();

    const livrePages: MetadataRoute.Sitemap = livres.map((livre: { id: number; dateAjout: string }) => ({
      url: `https://lescripts.com/livres/${livre.id}`,
      lastModified: new Date(livre.dateAjout),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...livrePages];
  } catch {
    return staticPages;
  }
}
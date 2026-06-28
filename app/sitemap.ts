import { MetadataRoute } from 'next';

export const revalidate = 3600; // cache 1 heure

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  try {
    // Timeout de 5 secondes
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${API_BASE_URL}/livres`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeout);

    if (!res.ok) return staticPages;

    const livres = await res.json();

    const livrePages: MetadataRoute.Sitemap = livres.map(
      (livre: { id: number; dateAjout: string }) => ({
        url: `https://lescripts.com/livres/${livre.id}`,
        lastModified: new Date(livre.dateAjout),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    );

    return [...staticPages, ...livrePages];
  } catch {
    // En cas d'erreur ou timeout, on retourne juste les pages statiques
    return staticPages;
  }
}
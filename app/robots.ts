export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
        crawlDelay: 10, // limite les bots à 1 requête/10s
      },
      {
        // Bots agressifs connus
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://lescripts.com/sitemap.xml',
  };
}
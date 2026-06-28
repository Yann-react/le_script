import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Le Script — Librairie en ligne',
    template: '%s | Le Script',
  },
  description: 'Découvrez notre sélection de livres disponibles en ligne. Romans, essais, poésie et bien plus.',
  keywords: ['librairie', 'livres', 'acheter livres', 'Le Script'],
  metadataBase: new URL('https://lescripts.com'),
   openGraph: {
    title: 'Le Script — Librairie en ligne',
    description: 'Découvrez notre sélection de livres.',
    url: 'https://lescripts.com',
    siteName: 'Le Script',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
    default: 'EAClique - Portal de Notícias',
    template: '%s - EAClique'
  },
  description: 'Portal de notícias com informações sobre tecnologia, economia, mundo, entretenimento e muito mais.',
  keywords: ['notícias', 'brasil', 'tecnologia', 'economia', 'esportes', 'entretenimento', 'portal de notícias'],
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br',
    siteName: 'EAClique',
  },
};

import { MegaHeader } from "@/components/MegaHeader";
import { Footer } from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <MegaHeader />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

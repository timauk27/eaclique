import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  VT323,
  Rye,
  Courier_Prime,
  Montserrat,
  Nunito,
  Bangers
} from "next/font/google";
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

const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323" });
const rye = Rye({ weight: "400", subsets: ["latin"], variable: "--font-rye" });
const courier = Courier_Prime({ weight: "400", subsets: ["latin"], variable: "--font-courier" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const bangers = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-bangers" });

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
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${vt323.variable} 
          ${rye.variable} 
          ${courier.variable} 
          ${montserrat.variable} 
          ${nunito.variable} 
          ${bangers.variable} 
          antialiased bg-gray-50
        `}
      >
        <ThemeProvider>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}
          <MegaHeader />
          {children}
          <Footer />
          <ThemeSwitcher />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}

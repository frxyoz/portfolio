import type { Metadata } from 'next';
import { Press_Start_2P, Inter } from 'next/font/google';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Olric Zeng Portfolio',
  description: 'Full stack developer portfolio with a Pokemon-inspired aesthetic.',
  openGraph: {
    title: 'Dev Portfolio',
    description: 'Full stack developer. Gotta catch \'em all — one bug at a time.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

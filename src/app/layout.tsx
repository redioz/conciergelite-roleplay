import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ConciergÉlite — Simulateur Roleplay',
  description: "Entraîne-toi à convaincre des propriétaires avec un agent vocal IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-bg antialiased">{children}</body>
    </html>
  );
}

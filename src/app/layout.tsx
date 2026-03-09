import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ConciergElite \u2014 Simulateur Roleplay',
  description: "Entra\u00eene-toi \u00e0 convaincre des propri\u00e9taires avec un agent vocal IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-bg antialiased">
        <div className="ambient-bg" />
        <div className="noise-overlay" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

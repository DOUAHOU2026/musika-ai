import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/context';
import { PlayerProvider } from '@/lib/player/context';
import { Navbar } from '@/components/layout/Navbar';
import { GlobalAudioPlayer } from '@/components/player/GlobalAudioPlayer';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'MUSIKA AI - Studio Musical IA Africain & Mondial',
  description:
    'Plateforme internationale de création musicale assistée par IA, spécialisée dans les rythmes africains (Afrobeat, Amapiano, Coupé-décalé, Zouglou...) et contemporains.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen flex flex-col bg-[#08090e] text-zinc-100 selection:bg-amber-500 selection:text-black">
        <LanguageProvider>
          <PlayerProvider>
            <Navbar />
            <main className="flex-1 pb-16">{children}</main>
            <Footer />
            <GlobalAudioPlayer />
          </PlayerProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

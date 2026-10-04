import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Birthday Harshita! 🎂✨ | A Magical Journey',
  description: 'An interactive unlock-the-memories birthday surprise adventure for Harshita.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0c0f24',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-midnight-950 text-white min-h-screen selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

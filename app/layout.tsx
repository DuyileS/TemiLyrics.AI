import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TemiLyrics - Explore the Heart and Soul Behind Your Favorite Music',
  description: 'AI-powered lyrics interpretation that uncovers the deeper meanings, emotions, and stories behind song lyrics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/icon.png" type="image/x-icon" />
      </head>
      <body>{children}</body>
    </html>
  );
}
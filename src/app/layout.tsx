import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/QueryProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mini Quiz Ambis',
  description: 'High Performance Quiz Platform',
  icons: {
    icon: '/Logo.png',
  },
};

// [DOCS] Root Layout aplikasi.
// Membungkus seluruh aplikasi dengan QueryProvider (React Query) dan Toaster (Notifikasi).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          {/* [DOCS] Komponen Toaster global untuk notifikasi toast */}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SakaSpace — Find Verified Property Opportunities Across Kenya',
  description: "Kenya's #1 verified property platform. Discover trusted listings with real-time verification scores.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: '#F5F7FA' }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { Inter, Castoro, IBM_Plex_Sans_Thai } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

const castoro = Castoro({
  variable: '--font-castoro',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const ibm = IBM_Plex_Sans_Thai({
  variable: '--font-ibm',
  subsets: ['latin'],
  weight: '400',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <body className={`${inter.className} ${castoro.variable} ${ibm.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </AuthProvider>
  );
};

export default RootLayout;

'use client';

import Header from '@/src/share/Header/Header';
import Footer from '@/src/share/Footer/Footer';

export default function SiteShell({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

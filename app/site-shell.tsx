'use client';

import Header from '@/src/share/Header/Header';
import Footer from '@/src/share/Footer/Footer';

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

import './globals.css';
import Providers from './providers';
import SiteShell from './site-shell';
import { getCatalog } from '@/src/lib/catalog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CoreDenz | Premium Technology & Electronics',
    template: '%s | CoreDenz',
  },
  description:
    'Shop premium laptops, electronics, and innovative technology at CoreDenz. Explore curated products with dependable service and fast delivery.',
  applicationName: 'CoreDenz',
  openGraph: {
    type: 'website',
    siteName: 'CoreDenz',
    title: 'CoreDenz | Premium Technology & Electronics',
    description:
      'Discover premium laptops, electronics, and technology curated for everyday life.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoreDenz | Premium Technology & Electronics',
    description:
      'Discover premium laptops, electronics, and technology curated for everyday life.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default async function RootLayout({ children }) {
  const { products, services } = await getCatalog();

  return (
    <html lang="en">
      <body>
        <Providers initialProducts={products} initialServices={services}>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}

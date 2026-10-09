import { getCatalog } from '@/src/lib/catalog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap() {
  const baseUrl = siteUrl.replace(/\/$/, '');
  const staticRoutes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/services/development',
    '/services/graphic-design',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));

  const { products } = await getCatalog();
  const productRoutes = products
    .filter(product => product.id || product._id)
    .map(product => ({
      url: `${baseUrl}/single-product/${encodeURIComponent(product.id || product._id)}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [...staticRoutes, ...productRoutes];
}

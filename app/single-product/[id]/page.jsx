import ProductContent from './product-content';
import { getProduct } from '@/src/lib/catalog';

function isProductAvailable(availability) {
  return (
    availability === true ||
    (typeof availability === 'number' && availability > 0) ||
    (typeof availability === 'string' &&
      /in stock|available/i.test(availability) &&
      !/out of stock|unavailable/i.test(availability))
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product details',
      description: 'Explore the product collection at CoreDenz.',
    };
  }

  const title = product.name || 'Premium technology product';
  const description =
    product.description ||
    `Explore ${title}${product.brand ? ` by ${product.brand}` : ''} at CoreDenz.`;
  const image = product.images?.[0] || product.image;

  return {
    title,
    description,
    alternates: { canonical: `/single-product/${encodeURIComponent(id)}` },
    openGraph: {
      title,
      description,
      type: 'website',
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <ProductContent />;
  }

  const isAvailable = isProductAvailable(product.availability);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || (product.image ? [product.image] : undefined),
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ProductContent />
    </>
  );
}

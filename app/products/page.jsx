import Products from '@/src/features/Products/Products';

export const metadata = {
  title: 'Shop laptops, gadgets & electronics',
  description:
    'Browse the CoreDenz collection of premium laptops, gadgets, and electronics. Find detailed product information and shop with confidence.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  return <Products />;
}

import Cart from '@/src/components/Cart/Cart';

export const metadata = {
  title: 'Your shopping cart',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <Cart />;
}

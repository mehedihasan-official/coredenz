import Checkout from '@/src/components/Checkout/Checkout';

export const metadata = {
  title: 'Secure checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}

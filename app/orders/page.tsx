import Orders from '@/src/components/Orders/Orders';

export const metadata = {
  title: 'Your orders',
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <Orders />;
}

import Contact from '@/src/features/Contact/Contact';

export const metadata = {
  title: 'Contact CoreDenz',
  description:
    'Get in touch with the CoreDenz team for product, order, and customer support.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <Contact />;
}

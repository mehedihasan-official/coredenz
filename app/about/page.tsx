import About from '@/src/features/About/About';

export const metadata = {
  title: 'About CoreDenz',
  description:
    'Learn about CoreDenz and our focus on making dependable, thoughtfully selected technology easy to shop.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <About />;
}

import WebDevLandingPage from '@/src/components/WebDevLandingPage';

export const metadata = {
  title: 'Web development',
  description:
    'Build a modern digital presence with CoreDenz web development services.',
  alternates: { canonical: '/web-dev-landing' },
};

export default function WebDevLandingRoute() {
  return <WebDevLandingPage />;
}

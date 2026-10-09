import GraphicDesign from '@/src/features/GraphicDesign/GraphicDesign';

export const metadata = {
  title: 'Graphic design services',
  description:
    'Explore CoreDenz branding, digital, print, and creative design services.',
  alternates: { canonical: '/services/graphic-design' },
};

export default function GraphicDesignPage() {
  return <GraphicDesign />;
}

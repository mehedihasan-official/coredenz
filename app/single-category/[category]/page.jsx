import SingleCategory from '@/src/components/SingleCategory/SingleCategory';

export async function generateMetadata({ params }) {
  const { category } = await params;
  const title = `${category.charAt(0).toUpperCase()}${category.slice(1)} products`;

  return {
    title,
    description: `Shop ${category} products at CoreDenz. Explore product details, specifications, and current availability.`,
    alternates: { canonical: `/single-category/${encodeURIComponent(category)}` },
  };
}

export default function CategoryPage() {
  return <SingleCategory />;
}

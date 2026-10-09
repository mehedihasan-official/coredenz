import Link from 'next/link';

export const metadata = {
  title: 'Terms of service',
  description: 'Review current CoreDenz purchase terms before ordering.',
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-950">Terms of service</h1>
      <p className="mt-6 leading-7 text-slate-700">
        CoreDenz is preparing its full purchase terms. Before placing an order,
        contact us to confirm product availability, payment, shipping, returns,
        and any order-specific conditions.
      </p>
      <p className="mt-4 leading-7 text-slate-700">
        The store operator should review and publish complete terms applicable
        to its business and jurisdiction before launch.
      </p>
      <Link href="/contact" className="mt-6 inline-block font-semibold text-cyan-700 hover:text-cyan-900">
        Contact CoreDenz
      </Link>
    </article>
  );
}

import Link from 'next/link';

export const metadata = {
  title: 'Privacy information',
  description: 'Learn how CoreDenz uses account and order information.',
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-950">Privacy information</h1>
      <p className="mt-6 leading-7 text-slate-700">
        CoreDenz uses account, cart, and order details to provide shopping
        services. Sign-in is handled by Firebase Authentication; account and
        order records are managed by the CoreDenz API.
      </p>
      <p className="mt-4 leading-7 text-slate-700">
        Contact us with questions about your information or to request details
        about how it is handled. The store operator should publish its complete
        privacy notice, including applicable rights and retention details,
        before launch.
      </p>
      <Link href="/contact" className="mt-6 inline-block font-semibold text-cyan-700 hover:text-cyan-900">
        Contact CoreDenz
      </Link>
    </article>
  );
}

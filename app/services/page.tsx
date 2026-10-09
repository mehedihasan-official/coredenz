import Link from 'next/link';

export const metadata = {
  title: 'Creative and technology services',
  description:
    'Discover CoreDenz web development and graphic design services for your next digital project.',
  alternates: { canonical: '/services' },
};

const services = [
  {
    title: 'Web & software development',
    description: 'Web, mobile, and backend solutions for growing businesses.',
    href: '/services/development',
  },
  {
    title: 'Graphic design',
    description: 'Branding, digital, print, and creative design services.',
    href: '/services/graphic-design',
  },
];

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 font-semibold uppercase tracking-widest text-cyan-700">
          CoreDenz services
        </p>
        <h1 className="text-4xl font-bold text-slate-950 md:text-5xl">
          Ideas, designed and built for what comes next.
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          Explore our creative and technology services.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map(service => (
          <Link
            key={service.href}
            href={service.href}
            className="rounded-2xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:border-cyan-600 hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-slate-950">
              {service.title}
            </h2>
            <p className="mt-3 text-slate-600">{service.description}</p>
            <span className="mt-6 inline-block font-semibold text-cyan-700">
              Explore service →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

# CoreDenz development

## Applications

- `app/` contains the Next.js App Router pages, shared layout, metadata, sitemap, and robots rules.
- `src/features/`, `src/components/`, and `src/share/` contain the storefront views and reusable UI.
- `src/lib/catalog.js` loads and revalidates the product/service catalog for server rendering.
- `coredenz-server/src/` contains the typed Express app, MongoDB connection, configuration, middleware, and route modules.

## Local setup

1. Copy `.env.example` to `.env.local` and add the Firebase web app configuration and public API URL.
2. Copy `coredenz-server/.env.example` to `coredenz-server/.env` and set the MongoDB credentials and allowed frontend origins.
3. Run `npm install` and `npm run dev` from `coredenz-server`.
4. Run `npm install` and `npm run dev` from `coredenz`.

The frontend's `NEXT_PUBLIC_SITE_URL` should be the deployed canonical origin. API and Firebase web configuration values are public client settings; MongoDB credentials must remain server-only.

The product catalog is server-rendered and cached for five minutes. Product pages expose product metadata and JSON-LD, and the sitemap includes product routes. Search ranking is determined by search engines and cannot be guaranteed by application code alone.

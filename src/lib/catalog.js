const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchCatalogResource(resource) {
  if (!apiUrl) {
    console.error(
      `NEXT_PUBLIC_API_URL is not configured; the initial ${resource} catalog will be empty.`
    );
    return [];
  }

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/${resource}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Catalog request failed with status ${response.status}`);
    }

    const items = await response.json();
    if (!Array.isArray(items)) {
      throw new Error(`Expected the ${resource} endpoint to return an array`);
    }

    return items;
  } catch (error) {
    console.error(`Unable to load the initial ${resource} catalog:`, error);
    return [];
  }
}

export async function getCatalog() {
  const [products, services] = await Promise.all([
    fetchCatalogResource('products'),
    fetchCatalogResource('services'),
  ]);

  return { products, services };
}

export async function getProduct(id) {
  if (!apiUrl) return null;

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, '')}/products/${encodeURIComponent(id)}`,
      { next: { revalidate: 300 } }
    );

    if (response.status === 404 || response.status === 400) return null;
    if (!response.ok) {
      throw new Error(`Product request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Unable to load product ${id} for metadata:`, error);
    return null;
  }
}

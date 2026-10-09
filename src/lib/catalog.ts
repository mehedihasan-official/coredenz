import { getApiUrl } from './api';
import { normalizeProduct, type Product, type Service } from '@/src/types/catalog';

async function fetchCatalogResource<T>(resource: string): Promise<T[]> {
  try {
    const response = await fetch(getApiUrl(resource), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `${resource} request failed with HTTP ${response.status} (${response.url})`
      );
    }

    const items: unknown = await response.json();
    if (!Array.isArray(items)) {
      throw new Error(`Expected the ${resource} endpoint to return an array.`);
    }

    return resource === 'products'
      ? items.map(normalizeProduct) as T[]
      : items as T[];
  } catch (error) {
    console.error(`Unable to load the initial ${resource} catalog:`, error);
    return [];
  }
}

export async function getCatalog(): Promise<{
  products: Product[];
  services: Service[];
}> {
  const [products, services] = await Promise.all([
    fetchCatalogResource<Product>('products'),
    fetchCatalogResource<Service>('services'),
  ]);

  return { products, services };
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(getApiUrl(`products/${encodeURIComponent(id)}`), {
      next: { revalidate: 300 },
    });

    if (response.status === 404 || response.status === 400) return null;
    if (!response.ok) {
      throw new Error(`Product request failed with HTTP ${response.status}.`);
    }

    return normalizeProduct(await response.json());
  } catch (error) {
    console.error(`Unable to load product ${id} for metadata:`, error);
    return null;
  }
}

export type ProductId = string | number;
export type Availability = boolean | number | string | undefined;

export interface Product {
  id: ProductId;
  _id?: string;
  name: string;
  price: number;
  brand?: string;
  category?: string;
  description?: string;
  images?: string[];
  image?: string;
  discount?: number;
  rating?: number;
  isNew?: boolean;
  availability?: Availability;
  specification?: Record<
    string,
    string | number | boolean | null | undefined
  >;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export interface Service {
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  features?: string[];
  image?: string;
  images?: string[];
  [key: string]: unknown;
}

export interface CartItem {
  _id?: string;
  userEmail?: string;
  userId?: string;
  productId: ProductId;
  quantity: number;
  specification?: Record<string, unknown>;
  productDetails?: Partial<Product>;
  id?: ProductId;
}

export interface CartProduct extends CartItem {
  productDetails: Product;
}

export interface Order {
  _id: string;
  status?: string;
  products: Array<{
    productId?: ProductId;
    name: string;
    image?: string;
    price?: number;
    quantity: number;
  }>;
  createdAt?: string | Date;
  orderDate?: string | Date;
  total?: number;
  totalAmount?: number;
  paymentMethod?: string;
  shippingInfo?: Record<string, string>;
  [key: string]: unknown;
}

export function normalizeProduct(value: unknown): Product {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The products API returned an invalid product record.');
  }

  const product = value as Record<string, unknown>;
  const rawId = product.id ?? product._id;
  const id =
    typeof rawId === 'object' && rawId !== null && '$oid' in rawId
      ? String((rawId as { $oid: unknown }).$oid)
      : rawId;

  if (
    (typeof id !== 'string' && typeof id !== 'number') ||
    typeof product.name !== 'string'
  ) {
    throw new Error('The products API returned a product without an ID or name.');
  }

  const price = Number(product.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Product "${product.name}" has an invalid price.`);
  }

  const images = Array.isArray(product.images)
    ? product.images.filter((image): image is string => typeof image === 'string')
    : typeof product.image === 'string'
      ? [product.image]
      : [];

  return {
    ...product,
    id,
    _id:
      typeof product._id === 'string'
        ? product._id
        : typeof id === 'string'
          ? id
          : undefined,
    name: product.name,
    price,
    images,
  } as Product;
}

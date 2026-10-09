const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export function getApiUrl(resource: string): string {
  if (!configuredApiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not configured. Set it to the base URL of the CoreDenz API.'
    );
  }

  let baseUrl: URL;
  try {
    baseUrl = new URL(configuredApiUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute HTTP(S) URL.');
  }

  if (baseUrl.protocol !== 'http:' && baseUrl.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_API_URL must use HTTP or HTTPS.');
  }

  const normalizedPath = baseUrl.pathname.replace(/\/+$/, '');
  const normalizedBase = `${baseUrl.origin}${normalizedPath}`;
  const normalizedResource = resource.replace(/^\/+/, '');
  return normalizedResource
    ? `${normalizedBase}/${normalizedResource}`
    : normalizedBase;
}

export function getApiBaseUrl(): string {
  return getApiUrl('');
}

'use client';

import AuthProvider from '@/src/provider/AuthProvider/AuthProvider';
import type { Product, Service } from '@/src/types/catalog';

interface ProvidersProps {
  children: React.ReactNode;
  initialProducts?: Product[];
  initialServices?: Service[];
}

export default function Providers({
  children,
  initialProducts,
  initialServices,
}: ProvidersProps) {
  return (
    <AuthProvider
      initialProducts={initialProducts}
      initialServices={initialServices}
    >
      {children}
    </AuthProvider>
  );
}

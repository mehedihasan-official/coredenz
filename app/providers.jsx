'use client';

import AuthProvider from '@/src/provider/AuthProvider/AuthProvider';

export default function Providers({
  children,
  initialProducts,
  initialServices,
}) {
  return (
    <AuthProvider
      initialProducts={initialProducts}
      initialServices={initialServices}
    >
      {children}
    </AuthProvider>
  );
}

import { Suspense } from 'react';

import SignIn from '@/src/features/SignIn/SignIn';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SignIn />
    </Suspense>
  );
}

export const metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

import ForgotPassword from '@/src/features/ForgotPassword/ForgotPassword';

export const metadata = {
  title: 'Reset your password',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}

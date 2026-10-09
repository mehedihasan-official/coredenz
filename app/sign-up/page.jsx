import SignUp from '@/src/features/SignUp/SignUp';

export const metadata = {
  title: 'Create your account',
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <SignUp />;
}

import Profile from '@/src/features/Profile/Profile';

export const metadata = {
  title: 'Your account',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <Profile />;
}

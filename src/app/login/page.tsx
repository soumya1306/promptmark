import { Metadata } from 'next';
import { AuthScreen } from '@/components/auth/AuthScreen';

export const metadata: Metadata = {
  title: 'Sign In | Promptmark Collaborative Sanctuary',
  description: 'Sign up or sign in to your Promptmark workspace with Google OAuth.',
};

export default function LoginPage() {
  return <AuthScreen />;
}

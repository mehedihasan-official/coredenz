'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/provider/AuthProvider/AuthProvider';

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      await sendPasswordReset(email);
      setMessage('If an account exists for that email, a reset link is on its way.');
    } catch (resetError) {
      console.error('Password reset request failed:', resetError);
      setError('Unable to send a reset link. Check the email address and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-slate-950">Reset your password</h1>
        <p className="mt-3 text-slate-600">
          Enter the email address associated with your CoreDenz account.
        </p>
        <label htmlFor="reset-email" className="mt-6 block font-medium text-slate-800">
          Email address
        </label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={event => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
        />
        {message && <p role="status" className="mt-4 text-green-700">{message}</p>}
        {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-cyan-700 px-4 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </button>
        <Link href="/sign-in" className="mt-5 inline-block font-medium text-cyan-700 hover:text-cyan-900">
          Back to sign in
        </Link>
      </form>
    </main>
  );
}

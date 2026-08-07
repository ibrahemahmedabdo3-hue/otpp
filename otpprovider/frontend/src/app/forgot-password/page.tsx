'use client';

import { useState } from 'react';
import Link from 'next/link';

const WHATSAPP_UAE = '971564201773';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const waLink = `https://wa.me/${WHATSAPP_UAE}?text=${encodeURIComponent(
    `Hi, I forgot my OTPProvider account password. My email is: ${email || '[enter your email]'}`,
  )}`;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-lg">
            OP
          </div>
          <h1 className="text-xl font-semibold">Forgot your password?</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your account email, then confirm on WhatsApp — our support team will verify your
            identity and reset it for you.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Account email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800"
              placeholder="you@company.com"
            />
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-95"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 20l1.3-3.9A8 8 0 1 1 8.9 19L4 20Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Continue on WhatsApp
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Remembered it?{' '}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

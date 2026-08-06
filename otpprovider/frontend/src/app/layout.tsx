import './globals.css';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OTPProvider — Verification Infrastructure for SMS, WhatsApp & Voice OTP',
  description:
    'OTPProvider delivers instant SMS, WhatsApp and Voice one-time passcodes with 99.99% uptime across 180+ countries.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={cairo.variable}>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-display">
        {children}
      </body>
    </html>
  );
}

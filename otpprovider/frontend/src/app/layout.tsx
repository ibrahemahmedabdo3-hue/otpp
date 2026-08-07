import './globals.css';
import type { Metadata } from 'next';
import { Cairo, JetBrains_Mono } from 'next/font/google';

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OTPProvider — Verification Infrastructure for SMS, WhatsApp & Voice OTP',
  description:
    'OTPProvider delivers instant SMS, WhatsApp, Voice and Email one-time codes with 99.99% uptime across 180+ countries.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${cairo.variable} ${mono.variable}`}>
      <body className="bg-[#F7F7FB] text-ink-900 font-display antialiased">
        {children}
      </body>
    </html>
  );
}

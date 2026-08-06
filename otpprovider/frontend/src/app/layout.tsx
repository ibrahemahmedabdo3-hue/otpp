import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OTPProvider Cloud',
  description: 'Enterprise OTP Delivery & Verification Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}

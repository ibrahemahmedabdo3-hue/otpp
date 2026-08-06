'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearSession } from '@/lib/api';
import MicroSitesPanel from '@/components/MicroSitesPanel';

type MenuItem = { label: string; roles: string[] };

const MENU: MenuItem[] = [
  { label: 'Overview', roles: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'CLIENT', 'RESELLER'] },
  { label: 'Users', roles: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'RESELLER'] },
  { label: 'OTP Console', roles: ['SUPER_ADMIN', 'ADMIN', 'CLIENT'] },
  { label: 'Wallet & Billing', roles: ['SUPER_ADMIN', 'ADMIN', 'CLIENT', 'RESELLER'] },
  { label: 'API Keys', roles: ['CLIENT', 'RESELLER'] },
  { label: 'Sub-domain Pages', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'System Settings', roles: ['SUPER_ADMIN'] },
  { label: 'Audit Logs', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Security', roles: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'CLIENT', 'RESELLER'] },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [active, setActive] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [destination, setDestination] = useState('');
  const [requestId, setRequestId] = useState('');
  const [code, setCode] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    api.get('/wallet').then(({ data }) => setWallet(data)).catch(() => {});
    api.get('/otp/history').then(({ data }) => setHistory(data)).catch(() => {});
  }, [user]);

  function logout() {
    clearSession();
    router.push('/login');
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setOtpStatus('Sending...');
    try {
      const { data } = await api.post('/otp/send', { channel: 'SMS', destination });
      setRequestId(data.requestId);
      setOtpStatus(`Sent. Request ID: ${data.requestId} (expires ${new Date(data.expiresAt).toLocaleTimeString()})`);
    } catch (err: any) {
      setOtpStatus(err.response?.data?.message?.toString() || 'Failed to send OTP');
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/otp/verify', { requestId, code });
      setOtpStatus('✅ Verified successfully');
      const { data } = await api.get('/otp/history');
      setHistory(data);
    } catch (err: any) {
      setOtpStatus(err.response?.data?.message?.toString() || 'Verification failed');
    }
  }

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading...</div>;
  }

  const visibleMenu = MENU.filter((m) => m.roles.includes(user.role));

  function selectItem(label: string) {
    setActive(label);
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: fixed drawer on mobile, static column on md+ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform border-r border-gray-200 bg-white p-4 transition-transform duration-200 ease-in-out dark:border-gray-800 dark:bg-gray-900 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              OP
            </div>
            <span className="font-semibold">OTPProvider</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="space-y-1">
          {visibleMenu.map((item) => (
            <button
              key={item.label}
              onClick={() => selectItem(item.label)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                active === item.label
                  ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-500'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold">{active}</h1>
              <p className="truncate text-sm text-gray-500">
                {user.firstName} {user.lastName} · <span className="uppercase">{user.role.replace('_', ' ')}</span>
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Log out
          </button>
        </div>

        {active === 'Overview' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs text-gray-500">Wallet Balance</p>
              <p className="mt-1 text-2xl font-semibold">
                {wallet ? `$${Number(wallet.balance).toFixed(2)}` : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs text-gray-500">OTPs Sent</p>
              <p className="mt-1 text-2xl font-semibold">{history.length}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs text-gray-500">Account Status</p>
              <p className="mt-1 text-2xl font-semibold">{user.status || 'ACTIVE'}</p>
            </div>
          </div>
        )}

        {active === 'OTP Console' && (
          <div className="max-w-lg space-y-6">
            <form onSubmit={sendOtp} className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-sm font-medium">Send SMS OTP</h2>
              <input
                type="text"
                required
                placeholder="+15551234567"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
              <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                Send Code
              </button>
            </form>

            <form onSubmit={verifyOtp} className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-sm font-medium">Verify Code</h2>
              <input
                type="text"
                required
                placeholder="Request ID"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
              <input
                type="text"
                required
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
              <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900">
                Verify
              </button>
            </form>

            {otpStatus && <p className="text-sm text-gray-600 dark:text-gray-300">{otpStatus}</p>}

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-sm font-medium">Recent OTP Requests</h2>
              <div className="space-y-2 text-sm">
                {history.length === 0 && <p className="text-gray-400">No requests yet.</p>}
                {history.map((h) => (
                  <div key={h.id} className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800">
                    <span>{h.destination}</span>
                    <span className="text-gray-500">{h.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === 'Wallet & Billing' && (
          <div className="max-w-md rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs text-gray-500">Current Balance</p>
            <p className="mt-1 text-3xl font-semibold">
              {wallet ? `$${Number(wallet.balance).toFixed(2)}` : '—'}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Recharge via Stripe, PayPal, USDT, or manual transfer is wired on the backend
              (<code>POST /wallet/recharge</code>) — connect a payment gateway UI here next.
            </p>
          </div>
        )}

        {active === 'Sub-domain Pages' && <MicroSitesPanel />}

        {!['Overview', 'OTP Console', 'Wallet & Billing', 'Sub-domain Pages'].includes(active) && (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700">
            {active} is scaffolded on the backend's RBAC system but the UI for this section is the
            next build increment.
          </div>
        )}
      </main>
    </div>
  );
}

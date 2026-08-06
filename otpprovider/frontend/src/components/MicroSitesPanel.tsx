'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type MicroSite = {
  id: string;
  subdomain: string;
  title: string;
  metaDescription: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  htmlContent: string;
  customCss: string | null;
  customJs: string | null;
  createdAt: string;
};

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'otpprovider.com';

const emptyForm = {
  subdomain: '',
  title: '',
  metaDescription: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  htmlContent: '<h1>Hello from your new sub-domain page</h1>',
  customCss: '',
  customJs: '',
};

export default function MicroSitesPanel() {
  const [sites, setSites] = useState<MicroSite[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function load() {
    api.get('/admin/microsites').then(({ data }) => setSites(data)).catch(() => {});
  }

  useEffect(load, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function startEdit(site: MicroSite) {
    setEditingId(site.id);
    setForm({
      subdomain: site.subdomain,
      title: site.title,
      metaDescription: site.metaDescription || '',
      status: site.status,
      htmlContent: site.htmlContent,
      customCss: site.customCss || '',
      customJs: site.customJs || '',
    });
    setError('');
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editingId) {
        const { subdomain, ...updatable } = form;
        await api.patch(`/admin/microsites/${editingId}`, updatable);
      } else {
        await api.post('/admin/microsites', form);
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message?.toString() || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(site: MicroSite) {
    await api.patch(`/admin/microsites/${site.id}`, {
      status: site.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this sub-domain page permanently?')) return;
    await api.delete(`/admin/microsites/${id}`);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">
          Create branded pages served live from the database on any sub-domain — no deploy needed.
        </p>
        <button
          onClick={startCreate}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + New Page
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={save}
          className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Sub-domain</label>
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                <input
                  type="text"
                  required
                  disabled={!!editingId}
                  value={form.subdomain}
                  onChange={(e) => setForm({ ...form, subdomain: e.target.value.toLowerCase() })}
                  className="w-full min-w-0 px-3 py-2 text-sm outline-none disabled:bg-gray-100 dark:bg-gray-800 dark:disabled:bg-gray-800"
                  placeholder="promo"
                />
                <span className="shrink-0 whitespace-nowrap bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800">
                  .{ROOT_DOMAIN}
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Page Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Meta Description</label>
            <input
              type="text"
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">HTML</label>
            <textarea
              required
              rows={8}
              value={form.htmlContent}
              onChange={(e) => setForm({ ...form, htmlContent: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Custom CSS</label>
              <textarea
                rows={5}
                value={form.customCss}
                onChange={(e) => setForm({ ...form, customCss: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Custom JS</label>
              <textarea
                rows={5}
                value={form.customJs}
                onChange={(e) => setForm({ ...form, customJs: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Page'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3">Sub-domain</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sites.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  No sub-domain pages yet.
                </td>
              </tr>
            )}
            {sites.map((site) => (
              <tr key={site.id} className="bg-white dark:bg-gray-950">
                <td className="px-4 py-3 font-mono text-xs">
                  {site.subdomain}.{ROOT_DOMAIN}
                </td>
                <td className="px-4 py-3">{site.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      site.status === 'PUBLISHED'
                        ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {site.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3 text-xs">
                    <button onClick={() => startEdit(site)} className="text-brand-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => togglePublish(site)} className="text-brand-600 hover:underline">
                      {site.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => remove(site.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

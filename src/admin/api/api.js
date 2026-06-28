import apiFetch from '../../utils/apiFetch';

const NGROK = { 'ngrok-skip-browser-warning': 'true' };

const handle401 = () => { localStorage.removeItem('admin_token'); window.location.href = '/login'; };

const api = {
  getToken: () => localStorage.getItem('admin_token'),

  async request(path, opts = {}) {
    const token = this.getToken();
    const res = await apiFetch(path, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...NGROK,
        ...(token ? { token } : {}),
        ...(opts.headers || {}),
      },
    });
    const data = await res.json();
    if (res.status === 401) { handle401(); return; }
    if (!res.ok) throw data;
    return data;
  },

  login: (body) => api.request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  // GET - public routes
  getStats: () => api.request('/api/superadmin/stats'),

  getProducts: (params = {}) => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null)));
    return api.request('/api/products' + (q.toString() ? '?' + q : ''));
  },
  getProduct: (id) => api.request('/api/products/' + id),

  // POST/PUT/DELETE - superadmin routes
  createProduct: async (formData) => {
    const token = api.getToken();
    const res = await apiFetch('/api/superadmin/products', {
      method: 'POST',
      headers: { ...NGROK, token: token || '' },
      body: formData,
    });
    const data = await res.json();
    if (res.status === 401) { handle401(); return; }
    if (!res.ok) throw data;
    return data;
  },

  updateProduct: async (id, formData) => {
    const token = api.getToken();
    const res = await apiFetch('/api/superadmin/products/' + id, {
      method: 'PUT',
      headers: { ...NGROK, token: token || '' },
      body: formData,
    });
    const data = await res.json();
    if (res.status === 401) { handle401(); return; }
    if (!res.ok) throw data;
    return data;
  },

  deleteProduct: (id) => api.request('/api/superadmin/products/' + id, { method: 'DELETE' }),
};

export default api;

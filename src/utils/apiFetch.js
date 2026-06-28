const BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function apiFetch(path, opts = {}) {
  return fetch(BASE + path, {
    ...opts,
    headers: {
      'ngrok-skip-browser-warning': 'true',
      ...(opts.headers || {}),
    },
  });
}

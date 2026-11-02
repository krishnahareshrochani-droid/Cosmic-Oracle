export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('The Oracle cannot reach the server. Check your connection and try again.', 0, {});
  }
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await res.json() : {};
  if (!res.ok) throw new ApiError(data.error || 'The cosmos is quiet right now. Please try again.', res.status, data);
  return data;
}

export const api = {
  catalog: () => request('/catalog'),
  cities: () => request('/cities'),
  me: () => request('/me'),
  setName: (name) => request('/me/name', { method: 'POST', body: { name } }),
  numeroscope: (payload) => request('/numerology', { method: 'POST', body: payload }),
  createOrder: (typeId) => request('/orders', { method: 'POST', body: { typeId } }),
  verifyOrder: (id, utr) => request(`/orders/${id}/verify`, { method: 'POST', body: { utr } }),
  createReading: (typeId, orderId, profile) => request('/readings', { method: 'POST', body: { typeId, orderId, profile } }),
  readings: () => request('/readings'),
  reading: (id) => request(`/readings/${id}`),
  deleteReading: (id) => request(`/readings/${id}`, { method: 'DELETE' })
};

export const money = (n) => (n === 0 ? 'Free' : `₹${Number(n).toLocaleString('en-IN')}`);

export const shortDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
};

export const saveDraft = (draft) => {
  try { localStorage.setItem('co_profile', JSON.stringify(draft)); } catch { /* ignore */ }
};

export const loadDraft = () => {
  try { return JSON.parse(localStorage.getItem('co_profile') || '{}'); } catch { return {}; }
};

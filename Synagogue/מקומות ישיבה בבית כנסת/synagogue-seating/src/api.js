const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = `שגיאת שרת (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function fetchLayout() {
  return request('/layout');
}

export function updateSeat(id, updates) {
  return request(`/seats/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export function createSeat(blockId, data) {
  return request(`/blocks/${blockId}/seats`, { method: 'POST', body: JSON.stringify(data) });
}

export function deleteSeat(id) {
  return request(`/seats/${id}`, { method: 'DELETE' });
}

export function addRow(blockId, row, count) {
  return request(`/blocks/${blockId}/seats/row`, {
    method: 'POST',
    body: JSON.stringify({ row, count }),
  });
}

export function clearBlockSeats(blockId) {
  return request(`/blocks/${blockId}/seats`, { method: 'DELETE' });
}

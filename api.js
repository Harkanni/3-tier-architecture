const BASE_URL = "https://12ytb8w5x1.execute-api.us-east-1.amazonaws.com/prod";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  return res.json().catch(() => null);
}

export const api = {
  getContacts:    ()           => request("/users"),
  createContact:  (payload)    => request("/insertuser",              { method: "POST",   body: JSON.stringify(payload) }),
  updateContact:  (id, payload)=> request(`/edituser?userId=${id}`,   { method: "PUT",    body: JSON.stringify(payload) }),
  deleteContact:  (id)         => request(`/deleteuser?userId=${id}`, { method: "DELETE" }),
};

"use client";

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (res.status === 401) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new Error("Session expired");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}

export const api = {
  list: <T,>(name: string) => req<T[]>(`/api/admin/collections/${name}`),
  create: <T,>(name: string, body: Partial<T>) => req<T>(`/api/admin/collections/${name}`, { method: "POST", body: JSON.stringify(body) }),
  update: <T,>(name: string, id: string, body: Partial<T>) =>
    req<T>(`/api/admin/collections/${name}/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (name: string, id: string) => req<{ ok: true }>(`/api/admin/collections/${name}/${id}`, { method: "DELETE" }),
  replace: <T,>(name: string, list: T[]) => req<T[]>(`/api/admin/collections/${name}`, { method: "PUT", body: JSON.stringify(list) }),
  getContent: <T,>(key: string) => req<T>(`/api/admin/content/${key}`),
  saveContent: <T,>(key: string, body: Partial<T>) => req<T>(`/api/admin/content/${key}`, { method: "PUT", body: JSON.stringify(body) }),
  reset: () => req<{ ok: true }>(`/api/admin/reset`, { method: "POST" }),
  logout: () => req<{ ok: true }>(`/api/auth/logout`, { method: "POST" }),
  async upload(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  },
};

"use client";

export function setAuthToken(token: string) {
  document.cookie = `authToken=${token}; path=/; max-age=3600`;
}

export function clearAuthToken() {
  document.cookie = "authToken=; path=/; max-age=0";
}

export function getAuthToken(): string | null {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/);
  return match ? match[2] : null;
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

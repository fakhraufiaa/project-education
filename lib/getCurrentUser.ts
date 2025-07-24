// lib/getCurrentUser.ts
export async function getCurrentUser() {
  const res = await fetch("/api/me", { credentials: "include" })
  if (!res.ok) return null
  const user = await res.json()
  return user
}

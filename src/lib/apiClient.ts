// Client HTTP pour API-Football (RapidAPI)

export const apiFetch = async (endpoint: string, params: Record<string, string>) => {
  const url = new URL("/api/football", window.location.origin)
  url.searchParams.append("endpoint", endpoint)
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v))
  
  const res = await fetch(url.toString())
  
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

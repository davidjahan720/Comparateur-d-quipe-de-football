// Client HTTP pour API-Football (RapidAPI)

export const apiFetch = async (endpoint: string, params: Record<string, string>) => {
  const url = new URL("https://v3.football.api-sports.io" + endpoint)
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v))
  
  console.log(">>> FETCH URL:", url.toString())
  
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
    },
  })
  
  console.log(">>> FETCH STATUS:", res.status)
  const json = await res.json()
  console.log(">>> FETCH RESPONSE:", json)
  
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return json
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { endpoint, ...params } = req.query;

  const url = new URL(`https://api-football-v3.p.rapidapi.com/v3${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v as string));

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "x-rapidapi-key": process.env.VITE_API_FOOTBALL_KEY || "",
        "x-rapidapi-host": process.env.VITE_API_FOOTBALL_HOST || "",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxy pour l'API Football
async function footballHandler(req: VercelRequest, res: VercelResponse) {
  const { endpoint, ...params } = req.query;
  const url = new URL(`https://api-football-v3.p.rapidapi.com/v3${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v as string));

  const response = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": process.env.VITE_API_FOOTBALL_KEY || "",
      "x-rapidapi-host": process.env.VITE_API_FOOTBALL_HOST || "",
    },
  });
  const data = await response.json();
  res.status(response.status).json(data);
}

// Analyse intelligente via Mistral
async function analysisHandler(req: VercelRequest, res: VercelResponse) {
  const { prevSquad, currSquad, coach, arrivals } = req.body;

  const prompt = `
    Analyse la force d'une équipe de football.
    Effectif N-1 (Score base 0): ${JSON.stringify(prevSquad)}
    Effectif N actuel: ${JSON.stringify(currSquad)}
    Entraîneur actuel: ${JSON.stringify(coach)}
    Nouvelles arrivées: ${JSON.stringify(arrivals)}
    
    Calcule un score ajusté en pourcentage (+/- X%) par rapport à l'an dernier.
    Réponds uniquement en JSON: { "scoreDelta": string, "reasoning": string }
  `;

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  res.status(200).json(JSON.parse(data.choices[0].message.content));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.url?.startsWith('/api/football')) return footballHandler(req, res);
  if (req.url?.startsWith('/api/analyze')) return analysisHandler(req, res);
  res.status(404).send("Not Found");
}

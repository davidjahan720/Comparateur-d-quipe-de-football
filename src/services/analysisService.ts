import type { SquadSeason, Player } from "../types/squad"

interface AnalysisResponse {
  scoreDelta: string
  reasoning: string
}

export const analyzeSquadStrength = async (
  prevSquad: SquadSeason,
  currSquad: SquadSeason,
  coach: { name: string },
  arrivals: Player[]
): Promise<AnalysisResponse> => {
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
      "Authorization": `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!response.ok) throw new Error("Erreur lors de l'analyse par Mistral")
  
  const data = await response.json()
  const raw = data.choices[0].message.content
  const cleaned = raw
    .replace(/```json\n?/g, '').replace(/```\n?/g, '')
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .trim()
  return JSON.parse(cleaned)
}

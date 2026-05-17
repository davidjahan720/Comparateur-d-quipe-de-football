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
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prevSquad,
      currSquad,
      coach,
      arrivals,
    }),
  })

  if (!res.ok) throw new Error("Erreur lors de l'analyse par Mistral")
  return res.json()
}

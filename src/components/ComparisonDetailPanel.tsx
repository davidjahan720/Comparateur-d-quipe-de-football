import { useState, useEffect } from "react"
import { analyzeSquadStrength } from "../services/analysisService"
import type { SquadSeason, Player } from "../types/squad"

interface Props {
  prevSquad: SquadSeason
  currSquad: SquadSeason
  arrivals: Player[]
}

export const ComparisonDetailPanel = ({ prevSquad, currSquad, arrivals }: Props) => {
  const [analysis, setAnalysis] = useState<{ scoreDelta: string; reasoning: string } | null>(null)

  useEffect(() => {
    // Appel à notre backend proxy sécurisé pour Mistral
    analyzeSquadStrength(prevSquad, currSquad, { name: "Coach Inconnu" }, arrivals)
      .then(setAnalysis)
      .catch(console.error)
  }, [prevSquad, currSquad, arrivals])

  return (
    <div className="p-4 bg-slate-900 rounded mt-4">
      <h3 className="text-xl font-bold mb-4">Analyse IA (Mistral)</h3>
      {analysis ? (
        <>
          <div className="text-3xl font-bold mb-2">
            {analysis.scoreDelta.startsWith('+') || analysis.scoreDelta.startsWith('-') 
              ? analysis.scoreDelta 
              : `+${analysis.scoreDelta}`}
          </div>
          <p className="text-slate-300 text-sm">{analysis.reasoning}</p>
        </>
      ) : (
        <div className="animate-pulse text-slate-500">Analyse en cours...</div>
      )}
    </div>
  )
}

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
    analyzeSquadStrength(prevSquad, currSquad, { name: "Coach Inconnu" }, arrivals)
      .then(setAnalysis)
      .catch(console.error)
  }, [prevSquad, currSquad, arrivals])

  const renderSimpleList = (players: Player[]) => {
    const positionOrder: Record<Position, number> = { GK: 1, DEF: 2, MID: 3, FWD: 4 };
    const sorted = [...players].sort((a, b) => {
        const posDiff = positionOrder[a.position] - positionOrder[b.position];
        return posDiff !== 0 ? posDiff : a.name.localeCompare(b.name);
    });

    return (
      <ul className="text-xs space-y-1">
        {sorted.map(p => (
          <li key={p.id} className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-300">{p.name}</span>
            <span className="text-slate-500 font-mono w-8 text-right">{p.position}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      {/* Affichage côte à côte des effectifs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-3 rounded">
          <h4 className="text-sm font-bold text-slate-400 mb-3 border-b border-slate-700 pb-2 uppercase">
            Effectif {prevSquad.seasonLabel} (N-1)
          </h4>
          {renderSimpleList(prevSquad.players)}
        </div>
        <div className="bg-slate-900 p-3 rounded">
          <h4 className="text-sm font-bold text-slate-400 mb-3 border-b border-slate-700 pb-2 uppercase">
            Effectif {currSquad.seasonLabel} (N)
          </h4>
          {renderSimpleList(currSquad.players)}
        </div>
      </div>

      {/* Analyse IA */}
      <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded shadow-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-blue-400">📊</span> Analyse IA (Mistral)
        </h3>
        {analysis ? (
          <>
            <div className={`text-3xl font-bold mb-3 ${analysis.scoreDelta.includes('-') ? 'text-red-400' : 'text-green-400'}`}>
              {analysis.scoreDelta.startsWith('+') || analysis.scoreDelta.startsWith('-') 
                ? analysis.scoreDelta 
                : `+${analysis.scoreDelta}`}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{analysis.reasoning}</p>
          </>
        ) : (
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Analyse en cours par Mistral...
          </div>
        )}
      </div>
    </div>
  )
}

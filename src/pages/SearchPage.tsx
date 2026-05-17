import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { searchTeams } from "../services/squadService"
import { useWatchlistStore } from "../store/watchlistStore"

export const SearchPage = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const { addTeam, hasTeam } = useWatchlistStore()

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length > 2) {
        const teams = await searchTeams(query)
        setResults(teams)
      }
    }, 500)
    return () => clearTimeout(handler)
  }, [query])

  return (
    <div className="p-4">
      <header className="mb-6">
        <Link to="/" className="text-blue-500 mb-2 block">← Retour</Link>
        <h1 className="text-2xl font-bold">Rechercher une équipe</h1>
      </header>

      <input 
        type="text" 
        placeholder="Rechercher une équipe..." 
        className="w-full p-2 bg-slate-800 rounded mb-4"
        onChange={(e) => setQuery(e.target.value)} 
      />
      <div className="mt-4 grid gap-2">
        {results.map((team) => (
          <div key={team.id} className="flex justify-between p-3 bg-slate-900 rounded items-center">
            <div>
              <div className="font-bold">{team.name}</div>
              <div className="text-xs text-slate-400">{team.country} - {team.league}</div>
            </div>
            {hasTeam(team.id) ? (
              <span className="text-sm text-slate-500">Déjà suivi</span>
            ) : (
              <button 
                onClick={() => addTeam(team)} 
                className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-500 transition-colors"
              >
                Ajouter
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

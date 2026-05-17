import { useState, useEffect } from "react"
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
      <input 
        type="text" 
        placeholder="Rechercher une équipe..." 
        className="w-full p-2 bg-slate-800 rounded"
        onChange={(e) => setQuery(e.target.value)} 
      />
      <div className="mt-4 grid gap-2">
        {results.map((team) => (
          <div key={team.id} className="flex justify-between p-2 bg-slate-900 rounded">
            <span>{team.name}</span>
            {hasTeam(team.id) ? (
              <span className="text-sm">Déjà suivi</span>
            ) : (
              <button onClick={() => addTeam(team)} className="text-blue-500">Ajouter</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

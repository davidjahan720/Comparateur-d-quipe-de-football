import { Link } from "react-router-dom"
import { useWatchlistStore } from "../store/watchlistStore"

export const WatchlistPage = () => {
  const { teams } = useWatchlistStore()

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Squad Tracker</h1>
        <Link to="/search" className="bg-blue-600 px-4 py-2 rounded">Ajouter une équipe</Link>
      </header>

      {teams.length === 0 ? (
        <div className="text-center mt-10 text-slate-400">Aucune équipe suivie</div>
      ) : (
        <div className="grid gap-4">
          {teams.map((team) => (
            <Link to={`/squad/${team.id}`} key={team.id} className="p-4 bg-slate-800 rounded hover:bg-slate-700 block transition-colors">
              <h2 className="font-bold">{team.name}</h2>
              <p className="text-sm text-slate-400">{team.league}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

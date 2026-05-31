import { Link } from "react-router-dom"
import { useWatchlistStore } from "../store/watchlistStore"

export const WatchlistPage = () => {
  const { teams, removeTeam } = useWatchlistStore()

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
            <div key={team.id} className="flex items-center gap-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors">
              <Link to={`/squad/${team.id}`} className="flex-1 p-4 block">
                <h2 className="font-bold">{team.name}</h2>
                <p className="text-sm text-slate-400">{team.league}</p>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); removeTeam(team.id); }}
                className="mr-3 px-3 py-1 text-sm bg-red-900 hover:bg-red-600 text-red-300 hover:text-white rounded transition-colors"
                title="Retirer de la liste"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

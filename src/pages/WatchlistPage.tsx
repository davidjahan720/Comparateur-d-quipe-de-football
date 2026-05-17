import { useWatchlistStore } from "../store/watchlistStore"

export const WatchlistPage = () => {
  const { teams } = useWatchlistStore()

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Squad Tracker</h1>
        <a href="/search" className="bg-blue-600 px-4 py-2 rounded">Ajouter une équipe</a>
      </header>

      {teams.length === 0 ? (
        <div className="text-center mt-10 text-slate-400">Aucune équipe suivie</div>
      ) : (
        <div className="grid gap-4">
          {teams.map((team) => (
            <div key={team.id} className="p-4 bg-slate-800 rounded">
              <h2 className="font-bold">{team.name}</h2>
              <p className="text-sm text-slate-400">{team.league}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

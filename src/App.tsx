import { WatchlistPage } from "./pages/WatchlistPage"
import { SearchPage } from "./pages/SearchPage"

function App() {
  const path = window.location.pathname

  return (
    <main className="max-w-2xl mx-auto min-h-screen">
      {path === "/" && <WatchlistPage />}
      {path === "/search" && <SearchPage />}
      {/* SquadDetailPage sera ajouté ultérieurement */}
    </main>
  )
}

export default App

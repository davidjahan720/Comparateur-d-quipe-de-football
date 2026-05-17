import { BrowserRouter, Routes, Route } from "react-router-dom"
import { WatchlistPage } from "./pages/WatchlistPage"
import { SearchPage } from "./pages/SearchPage"
import { SquadDetailPage } from "./pages/SquadDetailPage"

function App() {
  return (
    <BrowserRouter>
      <main className="max-w-2xl mx-auto min-h-screen">
        <Routes>
          <Route path="/" element={<WatchlistPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/squad/:teamId" element={<SquadDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App

import { useParams, Link } from "react-router-dom"
import { ComparisonDetailPanel } from "../components/ComparisonDetailPanel"

// Simulation de données pour le prototype (à remplacer par des appels réels via React Query)
const mockPrev: any = { players: [], totalPlayers: 20, avgAge: 25 }
const mockCurr: any = { players: [], totalPlayers: 22, avgAge: 24 }

export const SquadDetailPage = () => {
  const { teamId } = useParams()

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500 mb-2 block">← Retour</Link>
      <h1 className="text-2xl font-bold mb-6">Équipe {teamId}</h1>
      
      <div className="grid gap-4">
        <section className="p-4 bg-slate-800 rounded">
          <h2 className="font-bold">Bilan Saison</h2>
          <ComparisonDetailPanel 
            prevSquad={mockPrev} 
            currSquad={mockCurr} 
            arrivals={[]} 
          />
        </section>
      </div>
    </div>
  )
}

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { WatchlistTeam } from "../types/squad"

interface WatchlistStore {
  teams: WatchlistTeam[]
  addTeam: (team: WatchlistTeam) => void
  removeTeam: (teamId: number) => void
  hasTeam: (teamId: number) => boolean
}

const initialTeams: WatchlistTeam[] = [
  { id: 72, name: "QPR", nameOfficial: "Queens Park Rangers FC", logo: "https://media.api-sports.io/football/teams/72.png", country: "Angleterre", league: "EFL Championship" },
  { id: 51, name: "Brighton", nameOfficial: "Brighton & Hove Albion FC", logo: "https://media.api-sports.io/football/teams/51.png", country: "Angleterre", league: "Premier League" },
  { id: 66, name: "Aston Villa", nameOfficial: "Aston Villa FC", logo: "https://media.api-sports.io/football/teams/66.png", country: "Angleterre", league: "Premier League" },
  { id: 545, name: "Eibar", nameOfficial: "SD Eibar", logo: "https://media.api-sports.io/football/teams/545.png", country: "Espagne", league: "La Liga 2" },
  { id: 535, name: "Málaga", nameOfficial: "Málaga CF", logo: "https://media.api-sports.io/football/teams/535.png", country: "Espagne", league: "La Liga Hypermotion" },
  { id: 1346, name: "Coventry", nameOfficial: "Coventry City FC", logo: "https://media.api-sports.io/football/teams/1346.png", country: "Angleterre", league: "EFL Championship" },
  { id: 97, name: "Lorient", nameOfficial: "FC Lorient", logo: "https://media.api-sports.io/football/teams/97.png", country: "France", league: "Ligue 2" },
  { id: 55, name: "Brentford", nameOfficial: "Brentford FC", logo: "https://media.api-sports.io/football/teams/55.png", country: "Angleterre", league: "Premier League" },
  { id: 533, name: "Villarreal", nameOfficial: "Villarreal CF", logo: "https://media.api-sports.io/football/teams/533.png", country: "Espagne", league: "La Liga" },
].map(t => ({ ...t, needsIdResolution: false }))

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      teams: initialTeams,
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      removeTeam: (teamId) => set((state) => ({ teams: state.teams.filter((t) => t.id !== teamId) })),
      hasTeam: (teamId) => get().teams.some((t) => t.id === teamId),
    }),
    {
      name: "squad-tracker-watchlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

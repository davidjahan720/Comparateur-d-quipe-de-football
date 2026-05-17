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
  { id: 0, name: "QPR", nameOfficial: "Queens Park Rangers FC", logo: "", country: "Angleterre", league: "EFL Championship" },
  { id: 0, name: "Brighton", nameOfficial: "Brighton & Hove Albion FC", logo: "", country: "Angleterre", league: "Premier League" },
  { id: 0, name: "Aston Villa", nameOfficial: "Aston Villa FC", logo: "", country: "Angleterre", league: "Premier League" },
  { id: 0, name: "Eibar", nameOfficial: "SD Eibar", logo: "", country: "Espagne", league: "La Liga 2" },
  { id: 0, name: "Malaga", nameOfficial: "Málaga CF", logo: "", country: "Espagne", league: "La Liga Hypermotion" },
  { id: 0, name: "Coventry", nameOfficial: "Coventry City FC", logo: "", country: "Angleterre", league: "EFL Championship" },
  { id: 0, name: "Lorient", nameOfficial: "FC Lorient", logo: "", country: "France", league: "Ligue 2" },
  { id: 0, name: "Brentford", nameOfficial: "Brentford FC", logo: "", country: "Angleterre", league: "Premier League" },
  { id: 0, name: "Villarreal", nameOfficial: "Villarreal CF", logo: "", country: "Espagne", league: "La Liga" },
].map(t => ({ ...t, needsIdResolution: true }))

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

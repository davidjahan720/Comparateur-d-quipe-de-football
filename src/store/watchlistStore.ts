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
  { id: 85, name: "PSG", nameOfficial: "Paris Saint-Germain", logo: "...", country: "France", league: "Ligue 1" },
  { id: 541, name: "Real Madrid", nameOfficial: "Real Madrid", logo: "...", country: "Spain", league: "La Liga" },
  { id: 50, name: "Man City", nameOfficial: "Manchester City", logo: "...", country: "England", league: "Premier League" },
  { id: 157, name: "Bayern", nameOfficial: "Bayern Munich", logo: "...", country: "Germany", league: "Bundesliga" },
  { id: 0, name: "Local", nameOfficial: "Équipe locale", logo: "...", country: "France", league: "Local", needsIdResolution: true },
]

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

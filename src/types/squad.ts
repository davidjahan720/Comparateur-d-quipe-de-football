export type Position = "GK" | "DEF" | "MID" | "FWD"
export type SeasonSlot = "N-2" | "N-1" | "N"

export interface WatchlistTeam {
  id: number
  name: string
  nameOfficial: string
  logo: string
  country: string
  league: string
  needsIdResolution?: boolean
}

export interface Player {
  id: number
  name: string
  position: Position
  age: number
  nationality: string
  jerseyNumber?: number
  photo?: string
}

export interface SquadSeason {
  teamId: number
  teamName: string
  slot: SeasonSlot
  seasonYear: number
  seasonLabel: string
  players: Player[]
  totalPlayers: number
  avgAge: number
}

export interface PositionStat {
  previous: number
  current: number
  delta: number
  pct: number
}

export interface SquadComparison {
  teamId: number
  teamName: string
  teamLogo: string
  previousSeason: SquadSeason
  currentSeason: SquadSeason
  arrivals: Player[]
  departures: Player[]
  retained: Player[]
  retentionRate: number
  avgAgeDelta: number
  avgAgePct: number
  totalPlayersDelta: number
  totalPlayersPct: number
  positionBalance: Record<Position, PositionStat>
}

import { apiFetch } from "../lib/apiClient"
import type { WatchlistTeam, SquadSeason, Position, Player } from "../types/squad"

const mapPosition = (pos: string): Position => {
  switch (pos) {
    case "Goalkeeper": return "GK"
    case "Defender": return "DEF"
    case "Midfielder": return "MID"
    case "Attacker": return "FWD"
    default: return "DEF"
  }
}

export const searchTeams = async (query: string): Promise<WatchlistTeam[]> => {
  const data = await apiFetch("/teams", { search: query })
  return data.response.map((item: any) => ({
    id: item.team.id,
    name: item.team.name,
    nameOfficial: item.team.name,
    logo: item.team.logo,
    country: item.team.country,
    league: "", // À affiner si besoin via API
  }))
}

export const fetchSquad = async (teamId: number, seasonYear: number, seasonLabel: string): Promise<SquadSeason> => {
  const data = await apiFetch("/players/squads", { team: teamId.toString() })
  const players = data.response[0]?.players.map((p: any) => ({
    id: p.id,
    name: p.name,
    position: mapPosition(p.position),
    age: p.age,
    nationality: p.nationality,
    jerseyNumber: p.number,
    photo: p.photo,
  })) || []

  const totalAge = players.reduce((sum: number, p: Player) => sum + p.age, 0)
  
  return {
    teamId,
    teamName: data.response[0]?.team.name || "",
    slot: "N", // À déduire selon le contexte d'utilisation
    seasonYear,
    seasonLabel,
    players,
    totalPlayers: players.length,
    avgAge: players.length ? Number((totalAge / players.length).toFixed(1)) : 0,
  }
}

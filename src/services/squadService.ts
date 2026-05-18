import { apiFetch } from "../lib/apiClient"
import type { WatchlistTeam, SquadSeason, Position, Player } from "../types/squad"

const mapPosition = (pos: string): Position => {
  const p = pos?.toLowerCase() || "";
  if (p.includes("goalkeeper") || p === "g") return "GK";
  if (p.includes("defender") || p === "d") return "DEF";
  if (p.includes("midfielder") || p === "m") return "MID";
  if (p.includes("attacker") || p === "a") return "FWD";
  return "DEF";
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
  console.log("fetchSquad appelé", teamId, seasonYear);
  const isCurrent = seasonYear === 2025; // Saison actuelle 2025/26
  
  const endpoint = isCurrent ? "/players/squads" : "/players";
  const params = isCurrent 
    ? { team: teamId.toString() } 
    : { team: teamId.toString(), season: seasonYear.toString(), page: "1" };

  console.log("URL/Params:", endpoint, params);
  console.log("KEY:", import.meta.env.VITE_API_FOOTBALL_KEY ? "présente" : "ABSENTE");

  const data = await apiFetch(endpoint, params);
  
  console.log(`API Response for ${seasonLabel} (endpoint: ${endpoint}):`, data);
  console.log("response JSON:", JSON.stringify(data).slice(0, 500));

  let players: Player[] = [];
  let teamName = "";

  if (isCurrent) {
    teamName = data.response[0]?.team.name || "";
    players = data.response[0]?.players.map((p: any) => ({
      id: p.id,
      name: p.name,
      position: mapPosition(p.pos), // Attention: API utilise 'pos'
      age: p.age,
      nationality: "Unknown", // Non fourni par /players/squads
      jerseyNumber: p.number,
      photo: p.photo,
    })) || [];
  } else {
    teamName = data.response[0]?.statistics[0]?.team.name || "";
    players = data.response.map((item: any) => ({
      id: item.player.id,
      name: item.player.name,
      position: mapPosition(item.statistics[0].games.position),
      age: item.player.age,
      nationality: item.player.nationality,
      jerseyNumber: item.statistics[0].games.number,
      photo: item.player.photo,
    })) || [];
  }

  const totalAge = players.reduce((sum: number, p: Player) => sum + p.age, 0)
  
  return {
    teamId,
    teamName,
    slot: "N",
    seasonYear,
    seasonLabel,
    players,
    totalPlayers: players.length,
    avgAge: players.length ? Number((totalAge / players.length).toFixed(1)) : 0,
  }
}

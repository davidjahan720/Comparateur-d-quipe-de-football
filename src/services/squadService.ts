import { apiFetch } from "../lib/apiClient"
import type { WatchlistTeam, SquadSeason, Position, Player } from "../types/squad"

const normalizePosition = (pos: string): Position => {
  const p = pos?.toUpperCase()
  if (p === "G" || p === "GK" || p === "GOALKEEPER") return "GK"
  if (p === "D" || p === "DEF" || p === "DEFENDER") return "DEF"
  if (p === "M" || p === "MID" || p === "MIDFIELDER") return "MID"
  if (p === "F" || p === "FWD" || p === "ATTACKER" || p === "FORWARD") return "FWD"
  return "DEF" // fallback
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
  const isCurrent = seasonYear === 2025; // Saison actuelle 2025/26
  
  const endpoint = isCurrent ? "/players/squads" : "/players";
  let players: Player[] = [];
  let teamName = "";

  if (isCurrent) {
    const data = await apiFetch(endpoint, { team: teamId.toString() });
    teamName = data.response[0]?.team.name || "";
    players = data.response[0]?.players.map((p: any) => ({
      id: p.id,
      name: p.name,
      position: normalizePosition(p.position),
      age: p.age,
      nationality: "Unknown",
      jerseyNumber: p.number,
      photo: p.photo,
    })) || [];
  } else {
    // Boucle pour récupérer toutes les pages de joueurs (historique)
    let page = 1;
    let totalPages = 1;

    do {
      const data = await apiFetch(endpoint, { 
        team: teamId.toString(), 
        season: seasonYear.toString(), 
        page: page.toString() 
      });

      if (page === 1) {
        teamName = data.response[0]?.statistics[0]?.team.name || "";
        totalPages = data.paging.total;
      }

      const pagePlayers = data.response
        .filter((item: any) => (item.statistics[0]?.games?.appearences || 0) >= 1)
        .map((item: any) => ({
          id: item.player.id,
          name: item.player.name,
          position: normalizePosition(item.statistics[0].games.position),
          age: item.player.age,
          nationality: item.player.nationality,
          jerseyNumber: item.statistics[0].games.number,
          photo: item.player.photo,
        }));

      players = [...players, ...pagePlayers];
      page++;
    } while (page <= totalPages);
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

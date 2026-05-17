import type { SquadSeason, SquadComparison, Position, PositionStat } from "../types/squad"

export const computeComparison = (
  prev: SquadSeason,
  curr: SquadSeason,
  teamLogo: string
): SquadComparison => {
  const prevIds = new Set(prev.players.map((p) => p.id))
  const currIds = new Set(curr.players.map((p) => p.id))

  const arrivals = curr.players.filter((p) => !prevIds.has(p.id))
  const departures = prev.players.filter((p) => !currIds.has(p.id))
  const retained = curr.players.filter((p) => prevIds.has(p.id))

  const retentionRate = (retained.length / prev.players.length) * 100

  const getDeltaPct = (a: number, b: number) => {
    const delta = b - a
    const pct = a !== 0 ? (delta / a) * 100 : 0
    return { delta, pct }
  }

  const { delta: avgAgeDelta, pct: avgAgePct } = getDeltaPct(prev.avgAge, curr.avgAge)
  const { delta: totalPlayersDelta, pct: totalPlayersPct } = getDeltaPct(prev.totalPlayers, curr.totalPlayers)

  const positions: Position[] = ["GK", "DEF", "MID", "FWD"]
  const positionBalance = positions.reduce((acc, pos) => {
    const prevCount = prev.players.filter((p) => p.position === pos).length
    const currCount = curr.players.filter((p) => p.position === pos).length
    const { delta, pct } = getDeltaPct(prevCount, currCount)
    acc[pos] = { previous: prevCount, current: currCount, delta, pct }
    return acc
  }, {} as Record<Position, PositionStat>)

  return {
    teamId: curr.teamId,
    teamName: curr.teamName,
    teamLogo,
    previousSeason: prev,
    currentSeason: curr,
    arrivals,
    departures,
    retained,
    retentionRate,
    avgAgeDelta,
    avgAgePct,
    totalPlayersDelta,
    totalPlayersPct,
    positionBalance,
  }
}

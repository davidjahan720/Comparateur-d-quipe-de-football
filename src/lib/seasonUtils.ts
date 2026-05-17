import type { SeasonSlot } from "../types/squad"

export const getCurrentSeasonYear = (): number => {
  const now = new Date()
  // Une saison commence généralement en juillet
  return now.getMonth() + 1 >= 7 ? now.getFullYear() : now.getFullYear() - 1
}

export const formatSeasonLabel = (year: number): string =>
  `${year}/${String(year + 1).slice(2)}`

export const getThreeSeasons = (): { slot: SeasonSlot; year: number; label: string }[] => {
  const current = getCurrentSeasonYear()
  return [
    { slot: "N-2", year: current - 2, label: formatSeasonLabel(current - 2) },
    { slot: "N-1", year: current - 1, label: formatSeasonLabel(current - 1) },
    { slot: "N",   year: current,     label: formatSeasonLabel(current) },
  ]
}

import type { SeasonSlot } from "../types/squad"

export const getCurrentSeasonYear = (): number => {
  // En mai 2026, la saison en cours est 2025/26 (donc 2025).
  // Si mois < 7 (juillet), la saison en cours a commencé l'année précédente.
  const now = new Date()
  const month = now.getMonth() + 1
  return month >= 7 ? now.getFullYear() : now.getFullYear() - 1
}

export const formatSeasonLabel = (year: number): string =>
  `${year}/${String(year + 1).slice(2)}`

export const getThreeSeasons = (): { slot: SeasonSlot; year: number; label: string }[] => {
  const current = getCurrentSeasonYear() // 2025
  return [
    { slot: "N-2", year: current - 2, label: formatSeasonLabel(current - 2) }, // 2023/24
    { slot: "N-1", year: current - 1, label: formatSeasonLabel(current - 1) }, // 2024/25
    { slot: "N",   year: current,     label: formatSeasonLabel(current) },     // 2025/26
  ]
}

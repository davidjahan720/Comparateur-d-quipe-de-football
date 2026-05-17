import { useState, useMemo } from "react";
import type { Player, Position } from "../types/squad";

interface Props {
  players: Player[];
  prevPlayers?: Player[];
  isLoading?: boolean;
}

export const SquadTable = ({ players, prevPlayers = [], isLoading }: Props) => {
  const [filter, setFilter] = useState<Position | "ALL">("ALL");
  const [sortKey, setSortKey] = useState<"name" | "age" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filteredPlayers = useMemo(() => {
    let list = filter === "ALL" ? players : players.filter((p) => p.position === filter);
    
    // Ordre des postes pour le tri
    const positionOrder: Record<Position, number> = { GK: 1, DEF: 2, MID: 3, FWD: 4 };

    // Trier par poste par défaut, puis par sortKey si défini
    list = [...list].sort((a, b) => {
        if (filter === "ALL") {
            const posDiff = positionOrder[a.position] - positionOrder[b.position];
            if (posDiff !== 0) return posDiff;
        }

        if (sortKey) {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (typeof valA === "string" && typeof valB === "string") {
                return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === "number" && typeof valB === "number") {
                return sortDir === "asc" ? valA - valB : valB - valA;
            }
        }
        return 0;
    });
    return list;
  }, [players, filter, sortKey, sortDir]);

  const toggleSort = (key: "name" | "age") => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const isArrival = (p: Player) => !prevPlayers.some((prev) => prev.id === p.id);
  const isDeparture = (p: Player) => !players.some((curr) => curr.id === p.id);

  if (isLoading) {
    return <div className="animate-pulse space-y-2"><div className="h-10 bg-slate-700 rounded" />{[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-slate-800 rounded" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos) => (
          <button key={pos} onClick={() => setFilter(pos)} className={`px-3 py-1 rounded ${filter === pos ? "bg-blue-600" : "bg-slate-700"}`}>{pos}</button>
        ))}
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-slate-400 border-b border-slate-700">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort("name")}>Nom</th>
            <th className="p-2">Poste</th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort("age")}>Âge</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player) => (
            <tr key={player.id} className="border-b border-slate-800 hover:bg-slate-800">
              <td className="p-2">{player.jerseyNumber || "-"}</td>
              <td className="p-2 font-medium flex items-center gap-2">
                {player.name}
                {isArrival(player) && <span className="text-[10px] bg-green-900 text-green-300 px-1 rounded">ARRIVÉE</span>}
              </td>
              <td className="p-2">{player.position}</td>
              <td className="p-2">{player.age}</td>
            </tr>
          ))}
          {prevPlayers.filter(isDeparture).map((player) => (
             <tr key={player.id} className="border-b border-slate-800 opacity-50">
               <td className="p-2">{player.jerseyNumber || "-"}</td>
               <td className="p-2 font-medium flex items-center gap-2">
                 {player.name}
                 <span className="text-[10px] bg-red-900 text-red-300 px-1 rounded">DÉPART</span>
               </td>
               <td className="p-2">{player.position}</td>
               <td className="p-2">{player.age}</td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

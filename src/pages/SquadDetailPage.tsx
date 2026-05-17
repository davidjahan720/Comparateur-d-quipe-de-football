import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSquad } from "../services/squadService";
import { ComparisonDetailPanel } from "../components/ComparisonDetailPanel";
import { SquadTable } from "../components/SquadTable";
import { computeComparison } from "../lib/squadComparison";
import { getThreeSeasons } from "../lib/seasonUtils";

const SEASONS = getThreeSeasons();

export const SquadDetailPage = () => {
  const { teamId } = useParams();
  const [activeTab, setActiveTab] = useState(2); // Index de N

  const teamIdNum = Number(teamId);

  // Queries
  const { data: squad0, isLoading: load0 } = useQuery({ 
    queryKey: ["squad", teamIdNum, SEASONS[0].year], 
    queryFn: () => fetchSquad(teamIdNum, SEASONS[0].year, SEASONS[0].label), 
    staleTime: 1000 * 60 * 30,
    enabled: !!teamIdNum
  });
  const { data: squad1, isLoading: load1 } = useQuery({ 
    queryKey: ["squad", teamIdNum, SEASONS[1].year], 
    queryFn: () => fetchSquad(teamIdNum, SEASONS[1].year, SEASONS[1].label), 
    staleTime: 1000 * 60 * 30,
    enabled: !!teamIdNum
  });
  const { data: squad2, isLoading: load2 } = useQuery({ 
    queryKey: ["squad", teamIdNum, SEASONS[2].year], 
    queryFn: () => fetchSquad(teamIdNum, SEASONS[2].year, SEASONS[2].label), 
    staleTime: 1000 * 60 * 30,
    enabled: !!teamIdNum
  });

  const comparison = useMemo(() => {
    if (squad1 && squad2) return computeComparison(squad1, squad2, "");
    return null;
  }, [squad1, squad2]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-500 mb-4 block">← Retour</Link>
      <h1 className="text-2xl font-bold mb-6">Équipe {squad2?.teamName || teamId}</h1>
      
      <div className="flex gap-2 mb-6">
        {SEASONS.map((s, i) => (
          <button key={s.year} onClick={() => setActiveTab(i)} className={`px-4 py-2 rounded ${activeTab === i ? "bg-blue-600" : "bg-slate-800"}`}>{s.label}</button>
        ))}
        <button onClick={() => setActiveTab(3)} className={`px-4 py-2 rounded ${activeTab === 3 ? "bg-blue-600" : "bg-slate-800"}`}>📊 Bilan N-1 vs N</button>
      </div>

      <div className="bg-slate-800 p-4 rounded">
        {activeTab === 0 && <SquadTable players={squad0?.players || []} isLoading={load0} />}
        {activeTab === 1 && <SquadTable players={squad1?.players || []} prevPlayers={squad0?.players} isLoading={load1} />}
        {activeTab === 2 && <SquadTable players={squad2?.players || []} prevPlayers={squad1?.players} isLoading={load2} />}
        {activeTab === 3 && comparison && (
            <ComparisonDetailPanel prevSquad={comparison.previousSeason} currSquad={comparison.currentSeason} arrivals={comparison.arrivals} />
        )}
      </div>
    </div>
  );
};

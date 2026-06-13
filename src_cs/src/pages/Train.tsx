import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/train/sidebar";
import CompleteCodeView from "../components/train/completecodeview";
import DebugCodeView from "../components/train/debugcodeview";
import DetermineOutputView from "../components/train/determineoutputview";
import { useStore } from "../store/useStore";
import type { ActiveDrill, DrillCategory, Drill } from "../types/drills";

export default function Train() {
  const { lastDrill, setLastDrill, markDrillCompleted } = useStore();

  const [categories, setCategories] = useState<DrillCategory[]>([]);
  const [active, setActive] = useState<ActiveDrill | null>(null);

  useEffect(() => {
    fetch(`/data/train/drills.json`)
      .then(r => r.json())
      .then((c: DrillCategory[]) => setCategories(c))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    // If lastDrill exists in the store or active is already set, we use that. Otherwise we set first category/drill
    if (categories.length === 0) return;
    if (active) return;

    if (lastDrill) {
      setActive(lastDrill);
    } else {
      const activeDrill: ActiveDrill = { categoryId: categories[0].id, drillId: categories[0].drills[0].id };
      setActive(activeDrill);
      setLastDrill(activeDrill);
    }
  }, [categories, lastDrill]);

  function handleOpenDrill(categoryId: string, drillId: string) {
    setActive({ categoryId, drillId });
    setLastDrill({ categoryId, drillId });
  }

  function onMarkComplete() {
    if (!active) return;
    markDrillCompleted(active.drillId);
  }

  const activeDrill: Drill | null = useMemo(() => {
    if (!active) return null;
    const category = categories.find(c => c.id === active.categoryId);
    if (!category) return null;
    return category.drills.find(d => d.id === active.drillId) ?? null;
  }, [active, categories]);

  return (
    <div className="min-h-screen flex overflow-hidden h-screen font-display">
      <Sidebar
        categories={categories}
        activeCategoryId={active?.categoryId}
        activeDrillId={active?.drillId}
        onOpenDrill={handleOpenDrill}
      />

      <div className="flex-1 overflow-y-auto">
        {activeDrill ? (
          activeDrill.type === "complete-code" ? (
            <CompleteCodeView drill={activeDrill} onMarkComplete={onMarkComplete} />
          ) : activeDrill.type === "debug-code" ? (
            <DebugCodeView drill={activeDrill} onMarkComplete={onMarkComplete} />
          ) : (
            <DetermineOutputView drill={activeDrill} onMarkComplete={onMarkComplete} />
          )
        ) : (
          <div className="p-8">Loading...</div>
        )}
      </div>
    </div>
  );
}

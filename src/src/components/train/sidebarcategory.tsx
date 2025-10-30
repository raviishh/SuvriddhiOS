import { useStore } from "../../store/useStore";
import type { DrillCategory, Drill } from "../../types/drills";
import ProgressRing from "../learn/progressring";
import { Code2, Bug, Eye, ChevronDown, Check } from "lucide-react";

interface SidebarCategoryProps {
    category: DrillCategory;
    expanded: boolean;
    onToggle: (id: string) => void;
    activeDrillId?: string;
    onOpenDrill: (categoryId: string, drillId: string) => void;
    categoryProgress: number;
}

function getDrillIcon(drill: Drill) {
    switch (drill.type) {
        case "complete-code":
            return <Code2 size={16} />;
        case "debug-code":
            return <Bug size={16} />;
        case "determine-output":
            return <Eye size={16} />;
    }
}

function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
        case "easy":
            return "text-green-500";
        case "medium":
            return "text-yellow-500";
        case "hard":
            return "text-red-500";
        default:
            return "text-muted-foreground";
    }
}

export default function SidebarCategory({ category, expanded, onToggle, activeDrillId, onOpenDrill, categoryProgress }: SidebarCategoryProps) {
    const { drillsCompleted } = useStore();

    return (
        <div className="mb-4">
            <button
                onClick={() => onToggle(category.id)}
                className="w-full flex items-center justify-between rounded-md p-3 hover:bg-secondary"
            >
                <div className="flex items-center gap-4">
                    <div>
                        <ProgressRing progress={categoryProgress} />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-semibold">{category.title}</div>
                        <div className="text-xs text-muted-foreground">{category.drills.length} drills</div>
                    </div>
                </div>
                <div className="flex items-center ml-4 gap-3">
                    <ChevronDown className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                </div>
            </button>

            {expanded && (
                <div className="mt-2 ml-6">
                    {category.drills.map((drill: Drill) => (
                        <div key={drill.id} className="flex items-center justify-between py-2">
                            <button
                                onClick={() => onOpenDrill(category.id, drill.id)}
                                className={`text-left w-full hover:text-primary flex text-sm items-center gap-3 ${activeDrillId === drill.id ? "text-primary" : ""}`}
                            >
                                <span className="w-3 mr-2 inline-block">
                                    {getDrillIcon(drill)}
                                </span>
                                <span className="truncate flex-1">{drill.title}</span>
                                <span className={`text-xs ${getDifficultyColor(drill.difficulty)}`}>
                                    {drill.difficulty}
                                </span>
                            </button>
                            {Object.hasOwn(drillsCompleted, drill.id) && (
                                <span className="ml-2 text-primary">
                                    <Check className="w-4 h-4" />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


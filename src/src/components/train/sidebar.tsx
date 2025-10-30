import { useState } from "react";
import SidebarCategory from "./sidebarcategory";
import type { DrillCategory } from "../../types/drills";
import { useStore } from "../../store/useStore";
import { Link } from "react-router";
import { Home, Settings } from "lucide-react";

interface SidebarProps {
    categories: DrillCategory[];
    activeCategoryId?: string;
    activeDrillId?: string;
    onOpenDrill: (categoryId: string, drillId: string) => void;
}

export default function Sidebar({ categories, activeCategoryId, activeDrillId, onOpenDrill }: SidebarProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(activeCategoryId ?? (categories[0]?.id ?? null));
    const { getCategoryProgress } = useStore();

    function handleToggle(id: string) {
        setExpandedCategory(prev => (prev === id ? null : id));
    }

    return (
        <div className="flex flex-col flex-shrink-0 justify-between min-h-screen w-80 overflow-hidden p-6 pb-5 border-r border-border">
            <div className="overflow-y-auto h-full flex-1">
                {categories.map(category => (
                    <div key={category.id}>
                        <SidebarCategory
                            category={category}
                            expanded={expandedCategory === category.id}
                            onToggle={handleToggle}
                            activeDrillId={activeCategoryId === category.id ? activeDrillId : undefined}
                            onOpenDrill={onOpenDrill}
                            categoryProgress={getCategoryProgress(categories, category.id)}
                        />
                    </div>
                ))}
            </div>

            <div className="border-t border-border pt-5 flex justify-between px-4 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary transition-colors"><Home /></Link>
                <Link to="/settings" className="hover:text-primary transition-colors"><Settings /></Link>
            </div>
        </div>
    );
}


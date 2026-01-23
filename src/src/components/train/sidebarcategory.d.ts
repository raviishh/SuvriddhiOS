import type { DrillCategory } from "../../types/drills";
interface SidebarCategoryProps {
    category: DrillCategory;
    expanded: boolean;
    onToggle: (id: string) => void;
    activeDrillId?: string;
    onOpenDrill: (categoryId: string, drillId: string) => void;
    categoryProgress: number;
}
export default function SidebarCategory({ category, expanded, onToggle, activeDrillId, onOpenDrill, categoryProgress }: SidebarCategoryProps): import("preact").JSX.Element;
export {};

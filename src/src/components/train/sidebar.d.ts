import type { DrillCategory } from "../../types/drills";
interface SidebarProps {
    categories: DrillCategory[];
    activeCategoryId?: string;
    activeDrillId?: string;
    onOpenDrill: (categoryId: string, drillId: string) => void;
}
export default function Sidebar({ categories, activeCategoryId, activeDrillId, onOpenDrill }: SidebarProps): import("preact").JSX.Element;
export {};

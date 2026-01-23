import type { Topic } from "../../types/learningitems";
interface SidebarProps {
    topics: Topic[];
    activeTopicId?: string;
    activeItemId?: string;
    onOpenItem: (tId: string, iId: string) => void;
}
export default function Sidebar({ topics, activeTopicId, activeItemId, onOpenItem }: SidebarProps): import("preact").JSX.Element;
export {};

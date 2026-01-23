import type { Topic } from "../../types/learningitems";
interface SidebarTopicProps {
    topic: Topic;
    expanded: boolean;
    onToggle: (id: string) => void;
    activeItemId?: string;
    onOpenItem: (topicId: string, itemId: string) => void;
    topicProgress: number;
}
export default function SidebarTopic({ topic, expanded, onToggle, activeItemId, onOpenItem, topicProgress }: SidebarTopicProps): import("preact").JSX.Element;
export {};

import { useStore } from "../../store/useStore";
import type { Topic, TopicItem } from "../../types/learningitems";
import ProgressRing from "./progressring";
import { Book, Code2, ChevronDown, Check } from "lucide-react";

interface SidebarTopicProps {
    topic: Topic;
    expanded: boolean;
    onToggle: (id: string) => void;
    activeItemId?: string;
    onOpenItem: (topicId: string, itemId: string) => void;
    topicProgress: number;
}

export default function SidebarTopic({ topic, expanded, onToggle, activeItemId, onOpenItem, topicProgress } : SidebarTopicProps) {

    const { completed } = useStore();

    return (
        <div className="mb-4">
            <button
                onClick={() => onToggle(topic.id)}
                className="w-full flex items-center justify-between rounded-md p-3 hover:bg-secondary"
            >
                <div className="flex items-center gap-4">
                    <div>
                        <ProgressRing progress={topicProgress} />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-semibold">{topic.title}</div>
                        <div className="text-xs text-muted-foreground">{topic.items.length} items</div>
                    </div>
                </div>
                <div className="flex items-center ml-4 gap-3">
                    <ChevronDown className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                </div>
            </button>


            {expanded && (
                <div className="mt-2 ml-6">
                    {topic.items.map((it: TopicItem) => (
                        <div key={it.id} className="flex items-center justify-between py-2">
                            <button
                                onClick={() => onOpenItem(topic.id, it.id)}
                                className={`text-left w-full hover:text-primary flex text-sm items-center gap-3 ${activeItemId === it.id ? "text-primary" : ""}`}
                            >
                                <span className="w-3 mr-2 inline-block">
                                    {it.type === "lesson" ? <Book size={16} /> : <Code2 size={16} />}
                                </span>
                                <span className="truncate flex-1">{it.title}</span>
                            </button>
                            {Object.hasOwn(completed, it.id) && (
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
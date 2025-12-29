import { useState } from "react";
import SidebarTopic from "./sidebartopic";
import type { Topic } from "../../types/learningitems";
import { useStore } from "../../store/useStore";
import { Link } from "react-router";
import { Home, Settings } from "lucide-react";

interface SidebarProps {
    topics: Topic[];
    activeTopicId?: string;
    activeItemId?: string;
    onOpenItem: (tId: string, iId: string) => void;
}


export default function Sidebar({ topics, activeTopicId, activeItemId, onOpenItem }: SidebarProps) {
    const [expandedTopic, setExpandedTopic] = useState<string | null>(activeTopicId ?? (topics[0]?.id ?? null));
    const { getTopicProgress } = useStore();


    function handleToggle(id: string) {
        setExpandedTopic(prev => (prev === id ? null : id));
    }

    return (
        <div className="flex flex-col flex-shrink-0 justify-between min-h-screen w-110 overflow-hidden p-6 pb-5 border-r border-border"> {/* Potentially change to primary-muted */}
            <div className="overflow-y-auto h-full flex-1">
                {topics.map(topic => (
                    <div key={topic.id}>
                        <SidebarTopic
                            topic={topic}
                            expanded={expandedTopic === topic.id}
                            onToggle={handleToggle}
                            activeItemId={activeTopicId === topic.id ? activeItemId : undefined}
                            onOpenItem={onOpenItem}
                            topicProgress={getTopicProgress(topics, topic.id)}
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
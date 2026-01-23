import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useState } from "react";
import SidebarTopic from "./sidebartopic";
import { useStore } from "../../store/useStore";
import { Link } from "preact-router/match";
import { Home, Settings } from "lucide-preact";
export default function Sidebar({ topics, activeTopicId, activeItemId, onOpenItem }) {
    const [expandedTopic, setExpandedTopic] = useState(activeTopicId ?? (topics[0]?.id ?? null));
    const { getTopicProgress } = useStore();
    function handleToggle(id) {
        setExpandedTopic(prev => (prev === id ? null : id));
    }
    return (_jsxs("div", { className: "flex flex-col flex-shrink-0 justify-between min-h-screen w-80 overflow-hidden p-6 pb-5 border-r border-border", children: [" ", _jsx("div", { className: "overflow-y-auto h-full flex-1", children: topics.map(topic => (_jsx("div", { children: _jsx(SidebarTopic, { topic: topic, expanded: expandedTopic === topic.id, onToggle: handleToggle, activeItemId: activeTopicId === topic.id ? activeItemId : undefined, onOpenItem: onOpenItem, topicProgress: getTopicProgress(topics, topic.id) }) }, topic.id))) }), _jsxs("div", { className: "border-t border-border pt-5 flex justify-between px-4 text-sm text-muted-foreground", children: [_jsx(Link, { href: "/", className: "hover:text-primary transition-colors", children: _jsx(Home, {}) }), _jsx(Link, { href: "/settings", className: "hover:text-primary transition-colors", children: _jsx(Settings, {}) })] })] }));
}

import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Code2, BookOpen } from "lucide-preact";
import { useStore } from "../../store/useStore";
import { useEffect, useState } from "react";
import { Link } from "preact-router/match";
export default function RecentActivity({ lastActivity }) {
    const { getTopicProgress } = useStore();
    const [language] = useState("C");
    const [topics, setTopics] = useState([]);
    let path = "/data/learn/topics.json";
    useEffect(() => {
        if (language === "C") {
            path = "/data/learn/topics.json";
        }
        else if (language === "Python") {
            path = "/data/learn/topics_py.json";
        }
        fetch(path)
            .then(r => r.json())
            .then((t) => setTopics(t))
            .catch(() => setTopics([]));
    }, []);
    const topic = topics.find(t => t.id === lastActivity.topicId);
    const item = topic?.items.find(i => i.id === lastActivity.itemId);
    const progress = getTopicProgress(topics, lastActivity.topicId);
    if (!topic || !item)
        return _jsx(_Fragment, {});
    return (_jsxs(_Fragment, { children: [_jsx("h2", { className: "mb-6 text-2xl font-semibold", children: "Recent Activity" }), _jsx("div", { className: "rounded-lg border border-border bg-card p-6", children: _jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "mb-2 flex items-center gap-2", children: _jsx("span", { className: "text-sm text-muted-foreground", children: item.type === "lesson" ? _jsx(BookOpen, { size: 20 }) : _jsx(Code2, { size: 20 }) }) }), _jsx("h3", { className: "mb-3 text-lg font-semibold", children: topic.title }), _jsxs("div", { className: "mb-4 w-full max-w-xs", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Progress" }), _jsxs("span", { className: "text-xs font-medium text-primary", children: [progress, "%"] })] }), _jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-secondary/50", children: _jsx("div", { className: "h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500", style: { width: `${progress}%` } }) })] })] }), _jsx("div", { className: "flex sm:flex-col", children: _jsx(Link, { href: "/learn", children: _jsx("button", { className: "rounded-lg bg-primary-muted text-primary-foreground px-4 py-2 font-medium hover:opacity-80 active:scale-[0.97] transition-all", children: "Resume" }) }) })] }) })] }));
}

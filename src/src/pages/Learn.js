import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/learn/sidebar";
import LessonView from "../components/learn/lessonview";
import ExerciseView from "../components/learn/exerciseview";
import { useStore } from "../store/useStore";
export default function Learn() {
    const [language] = useState("C");
    const { setLastActivity, markItemCompleted, isItemCompleted } = useStore();
    const [topics, setTopics] = useState([]);
    const [active, setActive] = useState(null);
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
    useEffect(() => {
        if (topics.length === 0)
            return;
        const savedCompleted = localStorage.getItem("completedItems");
        if (savedCompleted) {
            const completedItems = JSON.parse(savedCompleted);
            completedItems.forEach(item => {
                if (!isItemCompleted(item.itemId))
                    markItemCompleted(item.itemId);
            });
        }
        if (!active) {
            const savedLast = localStorage.getItem("lastActivity");
            if (savedLast) {
                const parsed = JSON.parse(savedLast);
                if (parsed.topicId && parsed.itemId) {
                    setActive(parsed);
                    setLastActivity(parsed);
                }
            }
            else {
                const firstItem = { topicId: topics[0].id, itemId: topics[0].items[0].id };
                setActive(firstItem);
                setLastActivity(firstItem);
            }
        }
    }, [topics, active, markItemCompleted, isItemCompleted, setLastActivity]);
    function handleOpenItem(topicId, itemId) {
        setActive({ topicId, itemId });
        setLastActivity({ topicId, itemId });
    }
    function onMarkComplete() {
        if (!active)
            return;
        markItemCompleted(active.itemId);
        // Save current completed item
        const saved = localStorage.getItem("completedItems");
        let completedItems = saved ? JSON.parse(saved) : [];
        if (!completedItems.find((i) => i.itemId === active.itemId && i.topicId === active.topicId)) {
            completedItems.push({ topicId: active.topicId, itemId: active.itemId });
            localStorage.setItem("completedItems", JSON.stringify(completedItems));
        }
        // Move to next item
        const currentTopicIndex = topics.findIndex(t => t.id === active.topicId);
        if (currentTopicIndex === -1)
            return;
        const currentTopic = topics[currentTopicIndex];
        const currentItemIndex = currentTopic.items.findIndex(i => i.id === active.itemId);
        if (currentItemIndex === -1)
            return;
        if (currentItemIndex < currentTopic.items.length - 1) {
            handleOpenItem(active.topicId, currentTopic.items[currentItemIndex + 1].id);
        }
        else if (currentTopicIndex < topics.length - 1) {
            const nextTopic = topics[currentTopicIndex + 1];
            if (nextTopic.items.length > 0) {
                handleOpenItem(nextTopic.id, nextTopic.items[0].id);
            }
        }
    }
    const activeItem = useMemo(() => {
        if (!active)
            return null;
        const t = topics.find(x => x.id === active.topicId);
        return t?.items.find(i => i.id === active.itemId) ?? null;
    }, [active, topics]);
    return (_jsxs("div", { className: "min-h-screen flex overflow-hidden h-screen font-display", children: [_jsx(Sidebar, { topics: topics, activeTopicId: active?.topicId, activeItemId: active?.itemId, onOpenItem: handleOpenItem }), _jsx("div", { className: "flex-1 overflow-y-auto", children: activeItem ? (activeItem.type === "lesson" ? (_jsx(LessonView, { item: activeItem, onMarkComplete: onMarkComplete })) : (_jsx(ExerciseView, { item: activeItem, onMarkComplete: onMarkComplete }))) : (_jsx("div", { className: "p-8", children: "Loading..." })) })] }));
}

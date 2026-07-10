import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/learn/sidebar";
import LessonView from "../components/learn/lessonview";
import ExerciseView from "../components/learn/exerciseview";
import ChallengeView from "../components/learn/challengeview";
// import QuizView from "../components/learn/quizview";
// import ProjectView from "../components/learn/projectview";
import { useStore } from "../store/useStore";
import type { ActiveItem, Topic, TopicItem } from "../types/learningitems";
import type { LanguageType } from "../types/language";

export default function Learn() {
    const { language } = useStore();
    const { setLastActivity, markItemCompleted, isItemCompleted } = useStore();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [active, setActive] = useState<ActiveItem | null>(null);
    

    useEffect(() => {
        console.count("Learn mounted");
        
        let path = "/data/learn/topics.json";

        if (language === "Python") {
            path = "/data/learn/topics_py.json";
        }
        fetch(path)
            .then((r) => r.json())
            .then((t: Topic[]) => {
                console.log("Loaded topics:", t);
                setTopics(t);
            })
            .catch((e) => {
                console.error("Failed loading topics:", e);
                setTopics([]);
            });
        return () => console.log("Learn unmounted");
    }, [language]);

    useEffect(() => {
        if (topics.length === 0) return;

        const savedCompleted = localStorage.getItem("completedItems");
        if (savedCompleted) {
            const completedItems: { topicId: string; itemId: string }[] =
                JSON.parse(savedCompleted);
            completedItems.forEach((item) => {
                if (!isItemCompleted(item.itemId))
                    markItemCompleted(item.itemId);
            });
        }

        if (!active) {
            const savedLast = localStorage.getItem("lastActivity");
            if (savedLast) {
                const parsed: ActiveItem = JSON.parse(savedLast);
                const topicExists = topics.some((t) => t.id === parsed.topicId);

                if (topicExists) {
                    setActive(parsed);
                    setLastActivity(parsed);
                } else {
                    console.warn("Saved activity invalid, resetting.");

                    const firstItem = {
                        topicId: topics[0].id,
                        itemId: topics[0].items[0].id,
                    };

                    setActive(firstItem);
                    setLastActivity(firstItem);

                    localStorage.removeItem("lastActivity");
                }
            } else {
                const firstItem: ActiveItem = {
                    topicId: topics[0].id,
                    itemId: topics[0].items[0].id,
                };
                setActive(firstItem);
                setLastActivity(firstItem);
            }
        }
    }, [topics, active, markItemCompleted, isItemCompleted, setLastActivity]);

    function handleOpenItem(topicId: string, itemId: string) {
        setActive({ topicId, itemId });
        setLastActivity({ topicId, itemId });
    }

    function onMarkComplete() {
        if (!active) return;

        markItemCompleted(active.itemId);

        // Save current completed item
        const saved = localStorage.getItem("completedItems");
        let completedItems = saved ? JSON.parse(saved) : [];
        if (
            !completedItems.find(
                (i: any) =>
                    i.itemId === active.itemId && i.topicId === active.topicId,
            )
        ) {
            completedItems.push({
                topicId: active.topicId,
                itemId: active.itemId,
            });
            localStorage.setItem(
                "completedItems",
                JSON.stringify(completedItems),
            );
        }

        // Move to next item
        const currentTopicIndex = topics.findIndex(
            (t) => t.id === active.topicId,
        );
        if (currentTopicIndex === -1) return;

        const currentTopic = topics[currentTopicIndex];
        const currentItemIndex = currentTopic.items.findIndex(
            (i) => i.id === active.itemId,
        );
        if (currentItemIndex === -1) return;

        if (currentItemIndex < currentTopic.items.length - 1) {
            handleOpenItem(
                active.topicId,
                currentTopic.items[currentItemIndex + 1].id,
            );
        } else if (currentTopicIndex < topics.length - 1) {
            const nextTopic = topics[currentTopicIndex + 1];
            if (nextTopic.items.length > 0) {
                handleOpenItem(nextTopic.id, nextTopic.items[0].id);
            }
        }
    }
    console.log("language", language);
    console.log("topics", topics);
    console.log("active", active);
    const activeItem = useMemo(() => {
        console.log("Computing activeItem");

        if (!active) {
            console.log("No active item");
            return null;
        }

        const topic = topics.find((t) => t.id === active.topicId);

        console.log("Found topic:", topic);

        const item = topic?.items.find((i) => i.id === active.itemId);

        console.log("Found item:", item);

        return item ?? null;
    }, [active, topics]);

    if (!activeItem) {
        return (
            <div className="flex-1 flex items-center justify-center">
                Loading...
            </div>
        );
    }

    let content: JSX.Element;

    switch (activeItem.type) {
        case "lesson":
            content = (
                <LessonView item={activeItem} onMarkComplete={onMarkComplete} />
            );
            break;

        case "exercise":
            content = (
                <ExerciseView
                    item={activeItem}
                    onMarkComplete={onMarkComplete}
                />
            );
            break;

        case "challenge":
            content = (
                <ChallengeView
                    item={activeItem}
                    onMarkComplete={onMarkComplete}
                />
            );
            break;

        // case "quiz":
        //     content = (
        //         <QuizView item={activeItem} onMarkComplete={onMarkComplete} />
        //     );
        //     break;

        // case "project":
        //     content = (
        //         <ProjectView
        //             item={activeItem}
        //             onMarkComplete={onMarkComplete}
        //         />
        //     );
        //     break;

        default:
            content = (
                <LessonView item={activeItem} onMarkComplete={onMarkComplete} />
            );
    }
    return (
        <div className="min-h-screen flex overflow-hidden h-screen font-display">
            <Sidebar
                topics={topics}
                activeTopicId={active?.topicId}
                activeItemId={active?.itemId}
                onOpenItem={handleOpenItem}
            />

            <div className="flex-1 overflow-y-auto">{content}</div>
        </div>
    );
}

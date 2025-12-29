import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/learn/sidebar";
import LessonView from "../components/learn/lessonview";
import ExerciseView from "../components/learn/exerciseview";
import { useStore } from "../store/useStore";
import type { ActiveItem, Topic, TopicItem } from "../types/learningitems";

export default function Learn() {
  const { setLastActivity, markItemCompleted, isItemCompleted, subject } = useStore();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [active, setActive] = useState<ActiveItem | null>(null);

  // Load topics
  useEffect(() => {
    fetch(`/data/topics.json`)
      .then(r => r.json())
      .then((t: Topic[]) => setTopics(t))
      .catch(() => setTopics([]));
  }, []);

  // Restore completed items from localStorage
  useEffect(() => {
    if (topics.length === 0) return;

    const savedCompleted = localStorage.getItem("completedItems");
    if (savedCompleted) {
      const completedItems: { topicId: string; itemId: string }[] = JSON.parse(savedCompleted);
      completedItems.forEach(item => {
        if (!isItemCompleted(item.itemId)) markItemCompleted(item.itemId);
      });
    }
  }, [topics, isItemCompleted, markItemCompleted]);

  // Restore last active item or set first item
  useEffect(() => {
    if (topics.length === 0 || active) return;

    let firstItem: ActiveItem | null = null;
    const savedLast = localStorage.getItem("lastActivity");

    if (savedLast) {
      const parsed: ActiveItem = JSON.parse(savedLast);
      if (parsed.topicId && parsed.itemId) firstItem = parsed;
    }

    if (!firstItem && topics[0]?.items?.length) {
      firstItem = { topicId: topics[0].id, itemId: topics[0].items[0].id };
    }

    if (firstItem) {
      setActive(firstItem);
      setLastActivity(firstItem);
    }
  }, [topics, active, setLastActivity]);

  function handleOpenItem(topicId: string, itemId: string) {
    setActive({ topicId, itemId });
    setLastActivity({ topicId, itemId });
  }

  function onMarkComplete() {
    if (!active) return;

    markItemCompleted(active.itemId);

    // Save completed item
    const saved = localStorage.getItem("completedItems");
    let completedItems = saved ? JSON.parse(saved) : [];
    if (!completedItems.find((i: any) => i.itemId === active.itemId && i.topicId === active.topicId)) {
      completedItems.push({ topicId: active.topicId, itemId: active.itemId });
      localStorage.setItem("completedItems", JSON.stringify(completedItems));
    }

    // Move to next item safely
    const currentTopicIndex = topics.findIndex(t => t.id === active.topicId);
    if (currentTopicIndex === -1) return;

    const currentTopic = topics[currentTopicIndex];
    const currentItemIndex = currentTopic.items.findIndex(i => i.id === active.itemId);
    if (currentItemIndex === -1) return;

    if (currentItemIndex < currentTopic.items.length - 1) {
      handleOpenItem(active.topicId, currentTopic.items[currentItemIndex + 1].id);
    } else if (currentTopicIndex < topics.length - 1) {
      const nextTopic = topics[currentTopicIndex + 1];
      if (nextTopic.items?.length) {
        handleOpenItem(nextTopic.id, nextTopic.items[0].id);
      }
    }
  }

  const activeItem: TopicItem | null = useMemo(() => {
    if (!active) return null;
    const t = topics.find(x => x.id === active.topicId);
    return t?.items.find(i => i.id === active.itemId) ?? null;
  }, [active, topics]);

  return (
    <div className={`min-h-screen flex overflow-hidden h-screen font-display theme-${subject}`}>
      <Sidebar
        topics={topics}
        activeTopicId={active?.topicId}
        activeItemId={active?.itemId}
        onOpenItem={handleOpenItem}
      />

      <div className="flex-1 overflow-y-auto">
        {activeItem ? (
          activeItem.type === "lesson" ? (
            <LessonView item={activeItem} onMarkComplete={onMarkComplete} />
          ) : (
            <ExerciseView item={activeItem} onMarkComplete={onMarkComplete} />
          )
        ) : (
          <div className="p-8">Loading...</div>
        )}
      </div>
    </div>
  );
}
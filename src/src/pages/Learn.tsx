import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/learn/sidebar";
import LessonView from "../components/learn/lessonview";
import { useStore } from "../store/useStore";
import type { ActiveItem, Topic, TopicItem } from "../types/learningitems";
import ExerciseView from "../components/learn/exerciseview";


export default function Learn() {
  const { lastActivity, setLastActivity, markItemCompleted } = useStore();


  const [topics, setTopics] = useState<Topic[]>([]);
  const [active, setActive] = useState<ActiveItem | null>(null);


  useEffect(() => {
    fetch(`/data/topics.json`)
      .then(r => r.json())
      .then((t: Topic[]) => setTopics(t))
      .catch(() => setTopics([]));
  }, []);


  useEffect(() => {
    // if lastActivity exists in the store or active is already set, we use that. otherwise we set first topic/item
    if (topics.length === 0) return; // For dev
    if (active) return;


    if (lastActivity) {
      setActive(lastActivity);
    } else {
      const activeItem_: ActiveItem = { topicId: topics[0].id, itemId: topics[0].items[0].id };
      setActive(activeItem_);
      setLastActivity(activeItem_);
    }
  }, [topics, lastActivity]);


  function handleOpenItem(topicId: string, itemId: string) {
    setActive({ topicId, itemId });
    setLastActivity({ topicId, itemId });
  }


  function onMarkComplete() {
    if (!active) return;
    markItemCompleted(active.itemId);
  }


  const activeItem: TopicItem | null = useMemo(() => {
    if (!active) return null;
    const t = topics.find(x => x.id === active.topicId);
    if (!t) return null;
    return t.items.find(i => i.id === active.itemId) ?? null;
  }, [active, topics]);


  return (
    <div className="min-h-screen flex overflow-hidden h-screen font-display">
      <Sidebar topics={topics} activeTopicId={active?.topicId} activeItemId={active?.itemId} onOpenItem={handleOpenItem} />


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
import type { Topic } from "../types/learningitems";

export function getTopicProgress(topicId: string, topics: Topic[], completed: Record<string, boolean>): number { 
    const topic = topics.find((t) => t.id === topicId)
    if (!topic) return 0;

    const totalItems = topic.items.length
    if (totalItems === 0) return 0

    const completedCount = topic.items.filter((item) =>
      Object.hasOwn(completed, item.id)
    ).length

    return Math.round((completedCount / totalItems) * 100)
}
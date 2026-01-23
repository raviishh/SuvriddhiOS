import { create } from "zustand";
import { getTopicProgress } from "../utils/getTopicProgress";
export const useStore = create((set, get) => ({
    language: "C",
    setLanguage: (language) => set({ language }),
    lastActivity: null,
    setLastActivity: (la) => set({ lastActivity: la }),
    completed: {},
    markItemCompleted: (itemId) => set(state => ({ completed: { ...state.completed, [itemId]: true } })),
    getTopicProgress: (topics, topicId) => {
        const { completed } = get();
        return getTopicProgress(topicId, topics, completed);
    },
    isItemCompleted: (itemId) => !!get().completed[itemId],
    drafts: {},
    saveDraftForExercise: (itemId, code) => set(state => ({ drafts: { ...state.drafts, [itemId]: code } })),
    getDraftForExercise: (itemId) => get().drafts[itemId],
    // Train drills implementation
    lastDrill: null,
    setLastDrill: (drill) => set({ lastDrill: drill }),
    drillsCompleted: {},
    markDrillCompleted: (drillId) => set(state => ({ drillsCompleted: { ...state.drillsCompleted, [drillId]: true } })),
    isDrillCompleted: (drillId) => !!get().drillsCompleted[drillId],
    getCategoryProgress: (categories, categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category)
            return 0;
        const { drillsCompleted } = get();
        const completedCount = category.drills.filter(d => drillsCompleted[d.id]).length;
        return category.drills.length > 0 ? (completedCount / category.drills.length) * 100 : 0;
    },
    drillDrafts: {},
    saveDraftForDrill: (drillId, code) => set(state => ({ drillDrafts: { ...state.drillDrafts, [drillId]: code } })),
    getDraftForDrill: (drillId) => get().drillDrafts[drillId],
    drillAnswers: {},
    saveDrillAnswer: (drillId, answer) => set(state => ({ drillAnswers: { ...state.drillAnswers, [drillId]: answer } })),
    getDrillAnswer: (drillId) => get().drillAnswers[drillId],
}));

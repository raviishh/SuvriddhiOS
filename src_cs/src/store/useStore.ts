import { create } from "zustand";
import type { LanguageType } from "../types/language";
import type { ActiveItem, Topic } from "../types/learningitems";
import type { ActiveDrill, DrillCategory } from "../types/drills";
import { getTopicProgress } from "../utils/getTopicProgress";

interface Store {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;

  lastActivity: ActiveItem | null;
  setLastActivity: (item: ActiveItem) => void;

  completed: Record<string, boolean>;
  markItemCompleted: (itemId: string) => void;
  getTopicProgress: (topics: Topic[], topicId: string) => number;
  isItemCompleted: (itemId: string) => boolean;

  drafts: Record<string, string>;
  saveDraftForExercise: (itemId: string, code: string) => void;
  getDraftForExercise: (itemId: string) => string | undefined;

  // Train drills state
  lastDrill: ActiveDrill | null;
  setLastDrill: (drill: ActiveDrill) => void;

  drillsCompleted: Record<string, boolean>;
  markDrillCompleted: (drillId: string) => void;
  isDrillCompleted: (drillId: string) => boolean;
  getCategoryProgress: (categories: DrillCategory[], categoryId: string) => number;

  drillDrafts: Record<string, string>;
  saveDraftForDrill: (drillId: string, code: string) => void;
  getDraftForDrill: (drillId: string) => string | undefined;

  drillAnswers: Record<string, string>;
  saveDrillAnswer: (drillId: string, answer: string) => void;
  getDrillAnswer: (drillId: string) => string | undefined;
}

export const useStore = create<Store>((set, get) => ({
  language: "C",
  setLanguage: (language) => set({ language }),
  lastActivity: null,
  setLastActivity: (la) => set({ lastActivity: la }),
  completed: {},
  markItemCompleted: (itemId) => set(state => ({ completed: { ...state.completed, [itemId]: true } })),
  getTopicProgress: (topics: Topic[], topicId: string) => {
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
  getCategoryProgress: (categories: DrillCategory[], categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 0;
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

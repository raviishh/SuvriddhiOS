import { create } from "zustand";
import type { LanguageType } from "../types/language";
import type { ActiveItem, Topic } from "../types/learningitems";
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
}));

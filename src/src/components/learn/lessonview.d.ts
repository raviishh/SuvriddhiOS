import type { LessonItem } from "../../types/learningitems";
interface LessonViewProps {
    item: LessonItem;
    onMarkComplete: () => void;
}
export default function LessonView({ item, onMarkComplete }: LessonViewProps): import("preact").JSX.Element;
export {};

import type { ExerciseItem } from "../../types/learningitems";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
export default function ExerciseView({ item, onMarkComplete }: {
    item: ExerciseItem;
    onMarkComplete: () => void;
}): import("preact").JSX.Element;

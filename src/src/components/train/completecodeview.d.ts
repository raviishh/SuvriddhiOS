import type { CompleteCodeDrill } from "../../types/drills";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
export default function CompleteCodeView({ drill, onMarkComplete }: {
    drill: CompleteCodeDrill;
    onMarkComplete: () => void;
}): import("preact").JSX.Element;

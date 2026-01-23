import type { DebugCodeDrill } from "../../types/drills";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
export default function DebugCodeView({ drill, onMarkComplete }: {
    drill: DebugCodeDrill;
    onMarkComplete: () => void;
}): import("preact").JSX.Element;

import type { DetermineOutputDrill } from "../../types/drills";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
export default function DetermineOutputView({ drill, onMarkComplete }: {
    drill: DetermineOutputDrill;
    onMarkComplete: () => void;
}): import("preact").JSX.Element;

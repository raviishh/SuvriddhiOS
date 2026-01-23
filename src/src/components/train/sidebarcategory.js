import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useStore } from "../../store/useStore";
import ProgressRing from "../learn/progressring";
import { Code2, Bug, Eye, ChevronDown, Check } from "lucide-preact";
function getDrillIcon(drill) {
    switch (drill.type) {
        case "complete-code":
            return _jsx(Code2, { size: 16 });
        case "debug-code":
            return _jsx(Bug, { size: 16 });
        case "determine-output":
            return _jsx(Eye, { size: 16 });
    }
}
function getDifficultyColor(difficulty) {
    switch (difficulty) {
        case "easy":
            return "text-green-500";
        case "medium":
            return "text-yellow-500";
        case "hard":
            return "text-red-500";
        default:
            return "text-muted-foreground";
    }
}
export default function SidebarCategory({ category, expanded, onToggle, activeDrillId, onOpenDrill, categoryProgress }) {
    const { drillsCompleted } = useStore();
    return (_jsxs("div", { className: "mb-4", children: [_jsxs("button", { onClick: () => onToggle(category.id), className: "w-full flex items-center justify-between rounded-md p-3 hover:bg-secondary", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { children: _jsx(ProgressRing, { progress: categoryProgress }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm font-semibold", children: category.title }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [category.drills.length, " drills"] })] })] }), _jsx("div", { className: "flex items-center ml-4 gap-3", children: _jsx(ChevronDown, { className: `transition-transform ${expanded ? "rotate-180" : ""}` }) })] }), expanded && (_jsx("div", { className: "mt-2 ml-6", children: category.drills.map((drill) => (_jsxs("div", { className: "flex items-center justify-between py-2", children: [_jsxs("button", { onClick: () => onOpenDrill(category.id, drill.id), className: `text-left w-full hover:text-primary flex text-sm items-center gap-3 ${activeDrillId === drill.id ? "text-primary" : ""}`, children: [_jsx("span", { className: "w-3 mr-2 inline-block", children: getDrillIcon(drill) }), _jsx("span", { className: "truncate flex-1", children: drill.title }), _jsx("span", { className: `text-xs ${getDifficultyColor(drill.difficulty)}`, children: drill.difficulty })] }), Object.hasOwn(drillsCompleted, drill.id) && (_jsx("span", { className: "ml-2 text-primary", children: _jsx(Check, { className: "w-4 h-4" }) }))] }, drill.id))) }))] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useState } from "react";
import SidebarCategory from "./sidebarcategory";
import { useStore } from "../../store/useStore";
import { Link } from "preact-router/match";
import { Home, Settings } from "lucide-preact";
export default function Sidebar({ categories, activeCategoryId, activeDrillId, onOpenDrill }) {
    const [expandedCategory, setExpandedCategory] = useState(activeCategoryId ?? (categories[0]?.id ?? null));
    const { getCategoryProgress } = useStore();
    function handleToggle(id) {
        setExpandedCategory(prev => (prev === id ? null : id));
    }
    return (_jsxs("div", { className: "flex flex-col flex-shrink-0 justify-between min-h-screen w-80 overflow-hidden p-6 pb-5 border-r border-border", children: [_jsx("div", { className: "overflow-y-auto h-full flex-1", children: categories.map(category => (_jsx("div", { children: _jsx(SidebarCategory, { category: category, expanded: expandedCategory === category.id, onToggle: handleToggle, activeDrillId: activeCategoryId === category.id ? activeDrillId : undefined, onOpenDrill: onOpenDrill, categoryProgress: getCategoryProgress(categories, category.id) }) }, category.id))) }), _jsxs("div", { className: "border-t border-border pt-5 flex justify-between px-4 text-sm text-muted-foreground", children: [_jsx(Link, { href: "/", className: "hover:text-primary transition-colors", children: _jsx(Home, {}) }), _jsx(Link, { href: "/settings", className: "hover:text-primary transition-colors", children: _jsx(Settings, {}) })] })] }));
}

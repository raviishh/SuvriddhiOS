import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { BicepsFlexed, BookOpen, Code2 } from "lucide-preact";
import { Link } from "preact-router/match";
const buttons = [
    { id: 0, title: "Learn", desc: "Learn with structured lessons and exercises", icon: _jsx(BookOpen, { size: 32 }), to: "/learn" },
    { id: 1, title: "Train", desc: "Practice additional drills to strengthen your skills", icon: _jsx(BicepsFlexed, { size: 32 }), to: "/train" },
    { id: 2, title: "Sandbox", desc: "Experiment freely with code", icon: _jsx(Code2, { size: 32 }), to: "/sandbox" },
];
export default function MenuCards() {
    return (_jsx("div", { className: "grid gap-6 grid-cols-3", children: buttons.map((item) => (_jsx(Link, { href: item.to, className: "menu-card", children: _jsxs("div", { className: "menu-card-content", children: [_jsx("div", { className: "mb-4 text-4xl", children: item.icon }), _jsx("h3", { className: "mb-2 text-xl font-semibold", children: item.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: item.desc })] }) }, item.id))) }));
}

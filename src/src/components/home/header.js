import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Settings } from "lucide-preact";
import { Link } from "preact-router/match";
export default function Header() {
    return (_jsx("div", { className: "border-b border-border backdrop-blur-sm", children: _jsx("div", { className: "mx-auto max-w-7xl py-4 px-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: "/logo.jpg", alt: "SuvriddhiOS Logo", className: "h-10 w-10 mr-2 rounded-lg" }), _jsx("h1", { className: "text-xl", children: "SuvriddhiOS" })] }), _jsx(Link, { href: "/settings", children: _jsx("button", { className: "rounded-lg p-2 hover:bg-secondary transition-colors", children: _jsx(Settings, { size: 20 }) }) })] }) }) }));
}

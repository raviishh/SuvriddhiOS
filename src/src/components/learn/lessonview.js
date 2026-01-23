import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useState } from "react";
import { Check } from "lucide-preact";
export default function LessonView({ item, onMarkComplete }) {
    const [html, setHtml] = useState(null);
    useEffect(() => {
        fetch(`/data/learn/${item.contentFile}`)
            .then(r => r.text())
            .then(t => setHtml(t))
            .catch(() => setHtml("<p>Unable to load content.</p>"));
    }, [item.contentFile]);
    return (_jsxs("div", { className: "grow p-6", children: [_jsx("link", { rel: "stylesheet", href: "common.css" }), _jsx("div", { className: "max-w-none learning-container", dangerouslySetInnerHTML: { __html: html ?? "<p>Loading...</p>" } }), _jsx("div", { className: "flex items-center justify-center", children: _jsx("button", { onClick: onMarkComplete, className: "px-4 py-3 bg-secondary text-primary-foreground rounded-3xl font-medium shadow-md hover:bg-secondary/80 transition-all", children: _jsx(Check, {}) }) })] }));
}

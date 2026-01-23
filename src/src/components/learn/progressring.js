import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
export default function ProgressRing({ size = 28, stroke = 5, progress = 0 }) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return (_jsxs("svg", { width: size, height: size, className: "inline-block", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "grad", x1: "0%", x2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "var(--color-primary)" }), _jsx("stop", { offset: "100%", stopColor: "rgb(142,124,195)" })] }) }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, strokeWidth: stroke, stroke: "var(--color-muted)", fill: "none" }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, strokeWidth: stroke, strokeLinecap: "round", stroke: "url(#grad)", strokeDasharray: circumference, strokeDashoffset: offset, fill: "none", transform: `rotate(-90 ${size / 2} ${size / 2})` })] }));
}

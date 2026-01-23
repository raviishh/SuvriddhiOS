import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
export default function OutputFeedback({ output, isSuccess, successMessage = "Code is correct!", errorMessage = "Error", emptyMessage = "No output yet. Run your code to see results." }) {
    return (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-medium mb-3", children: "Output" }), output ? (_jsxs("div", { className: `p-4 rounded-md ${isSuccess === true ? "bg-green-500/10 border border-green-500/20" :
                    isSuccess === false ? "bg-red-500/10 border border-red-500/20" :
                        "bg-card border border-border"}`, children: [isSuccess !== null && (_jsx("p", { className: `font-medium mb-2 ${isSuccess ? "text-green-500" : "text-red-500"}`, children: isSuccess ? `✅ ${successMessage}` : `❌ ${errorMessage}` })), _jsx("pre", { className: "text-sm text-foreground whitespace-pre-wrap", children: output })] })) : (_jsx("div", { className: "p-4 rounded-md bg-card border border-border", children: _jsx("p", { className: "text-muted-foreground", children: emptyMessage }) }))] }));
}

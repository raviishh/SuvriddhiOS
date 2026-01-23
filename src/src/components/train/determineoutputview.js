import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
export default function DetermineOutputView({ drill, onMarkComplete }) {
    const { getDrillAnswer, saveDrillAnswer } = useStore();
    const [userAnswer, setUserAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    useEffect(() => {
        // Load existing answer if exists
        const savedAnswer = getDrillAnswer(drill.id);
        if (savedAnswer) {
            setUserAnswer(savedAnswer);
        }
        else {
            setUserAnswer("");
        }
        setSubmitted(false);
        setIsCorrect(false);
    }, [drill.id]);
    function handleSubmit() {
        const trimmedAnswer = userAnswer.trim();
        const trimmedCorrect = drill.correctOutput.trim();
        const correct = trimmedAnswer === trimmedCorrect;
        setIsCorrect(correct);
        setSubmitted(true);
        saveDrillAnswer(drill.id, userAnswer);
        if (correct) {
            onMarkComplete();
        }
    }
    function handleReset() {
        setUserAnswer("");
        setSubmitted(false);
        setIsCorrect(false);
        saveDrillAnswer(drill.id, "");
    }
    return (_jsxs("div", { className: "grow p-6 flex flex-col", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: drill.title }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${drill.difficulty === "easy" ? "bg-green-500/20 text-green-500" :
                                    drill.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-500" :
                                        "bg-red-500/20 text-red-500"}`, children: drill.difficulty })] }), _jsx("p", { className: "text-muted-foreground mb-4", children: drill.description })] }), _jsxs("div", { className: "flex-1 flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Code to Analyze" }), _jsx("div", { className: "border border-border rounded-lg overflow-hidden shadow-sm bg-card", children: _jsx(AceEditor, { mode: "c_cpp", theme: "tomorrow_night_eighties", name: "code-viewer", value: drill.code, fontSize: 14, width: "100%", height: "300px", showPrintMargin: false, showGutter: true, highlightActiveLine: false, readOnly: true, setOptions: {
                                        useWorker: false,
                                        tabSize: 2,
                                    } }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Your Answer" }), _jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "What will this code output? Enter your answer exactly as it would appear." }), _jsx("textarea", { value: userAnswer, onChange: (e) => setUserAnswer(e.target.value), disabled: submitted && isCorrect, className: "w-full h-32 p-3 rounded-md bg-card border border-border text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50", placeholder: "Enter the expected output here..." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: handleSubmit, disabled: submitted && isCorrect, className: "px-4 py-2 rounded-md bg-primary-muted text-primary-foreground disabled:opacity-50", children: submitted && isCorrect ? "Completed ✓" : "Submit Answer" }), submitted && !isCorrect && (_jsx("button", { onClick: handleReset, className: "px-3 py-2 rounded-md border border-border", children: "Try Again" }))] }), submitted && (_jsx("div", { className: `p-4 rounded-md ${isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`, children: isCorrect ? (_jsxs("div", { children: [_jsx("p", { className: "text-green-500 font-medium mb-2", children: "\u2705 Correct!" }), drill.explanation && (_jsx("p", { className: "text-sm text-muted-foreground", children: drill.explanation }))] })) : (_jsxs("div", { children: [_jsx("p", { className: "text-red-500 font-medium mb-2", children: "\u274C Incorrect" }), _jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "Your answer:" }), _jsx("pre", { className: "bg-card p-2 rounded text-sm mb-2", children: userAnswer || "(empty)" }), _jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "Correct answer:" }), _jsx("pre", { className: "bg-card p-2 rounded text-sm", children: drill.correctOutput }), drill.explanation && (_jsx("p", { className: "text-sm text-muted-foreground mt-2", children: drill.explanation }))] })) }))] })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import OutputFeedback from "../common/outputfeedback";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
export default function CompleteCodeView({ drill, onMarkComplete }) {
    const [language] = useState("C");
    const { getDraftForDrill, saveDraftForDrill } = useStore();
    const [code, setCode] = useState(drill.starterCode);
    const [output, setOutput] = useState(null);
    const [running, setRunning] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [isSuccess, setIsSuccess] = useState(null);
    useEffect(() => {
        // Load existing draft of code if exists
        const draft = getDraftForDrill(drill.id);
        if (draft) {
            setCode(draft);
        }
        else {
            setCode(drill.starterCode);
        }
        setDraftLoaded(true);
        setOutput(null);
        setIsSuccess(null);
    }, [drill.id]);
    // Autosave draft of code on change
    useEffect(() => {
        if (draftLoaded)
            saveDraftForDrill(drill.id, code);
    }, [code, draftLoaded]);
    async function handleSubmit() {
        setRunning(true);
        setOutput(null);
        setIsSuccess(null);
        if (language === "Python") {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/python", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, tests: drill.tests })
                });
                const json = await res.json();
                if (json.success) {
                    setOutput("All tests passed!");
                    setIsSuccess(true);
                    onMarkComplete();
                }
                else {
                    setOutput(`Test failed on the following test case:${json.input === "" ? "" : `\n\nInput: ${json.input}`}\n\nOutput: ${json.output}\n\nExpected: ${json.expected}`);
                    setIsSuccess(false);
                }
            }
            catch (e) {
                setOutput("Runtime error: " + String(e.message ?? e));
                setIsSuccess(false);
            }
            finally {
                setRunning(false);
            }
            return;
        }
        try {
            const compileRes = await fetch("http://127.0.0.1:8000/api/compile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });
            const compileJson = await compileRes.json();
            if (compileJson.error) {
                setOutput(`Compilation error: ${compileJson.error}`);
                setIsSuccess(false);
                setRunning(false);
                return;
            }
            const runRes = await fetch("http://127.0.0.1:8000/api/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: compileJson.token, tests: drill.tests })
            });
            const runJson = await runRes.json();
            if (runJson.success) {
                setOutput("All tests passed!");
                setIsSuccess(true);
                onMarkComplete();
            }
            else {
                setOutput(`Test failed on the following test case:${runJson.input === "" ? "" : `\n\nInput: ${runJson.input}`}\n\nOutput: ${runJson.output}\n\nExpected: ${runJson.expected}`);
                setIsSuccess(false);
            }
        }
        catch (e) {
            setOutput("Runtime error: " + String(e.message ?? e));
            setIsSuccess(false);
        }
        finally {
            setRunning(false);
        }
    }
    return (_jsxs("div", { className: "grow p-6 flex flex-col", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: drill.title }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${drill.difficulty === "easy" ? "bg-green-500/20 text-green-500" :
                                    drill.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-500" :
                                        "bg-red-500/20 text-red-500"}`, children: drill.difficulty })] }), _jsx("p", { className: "text-muted-foreground", children: drill.description })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "border border-border rounded-lg overflow-hidden shadow-sm bg-card", children: _jsx(AceEditor, { mode: "c_cpp", theme: "tomorrow_night_eighties", name: "editor", value: code, onChange: (val) => setCode(val), fontSize: 14, width: "100%", height: "400px", showPrintMargin: false, showGutter: true, highlightActiveLine: true, setOptions: {
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                useWorker: false,
                                tabSize: 2,
                            } }) }), _jsxs("div", { className: "mt-4 flex items-center gap-3", children: [_jsx("button", { onClick: handleSubmit, disabled: running, className: "px-4 py-2 rounded-md bg-primary-muted text-primary-foreground disabled:opacity-50", children: running ? "Running..." : "Submit Solution" }), _jsx("button", { onClick: () => { setCode(drill.starterCode); }, className: "px-3 py-2 rounded-md border border-border", children: "Reset" })] }), _jsx(OutputFeedback, { output: output, isSuccess: isSuccess, emptyMessage: "No output yet. Submit your solution to see results." })] })] }));
}

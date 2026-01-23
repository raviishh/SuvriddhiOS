import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { useStore } from "../../store/useStore";
import OutputFeedback from "../common/outputfeedback";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
export default function ExerciseView({ item, onMarkComplete }) {
    let starterCode = "";
    const [language] = useState("C");
    if (language === "Python") {
        starterCode = "print('Hello, World!')\n";
    }
    else {
        starterCode = "#include <stdio.h>\nint main() {\n\t\n\t\n\t\n\treturn 0;\n}\n";
    }
    const { getDraftForExercise, saveDraftForExercise } = useStore();
    const [descriptionHtml, setDescriptionHtml] = useState(null);
    const [code, setCode] = useState(starterCode);
    const [output, setOutput] = useState(null);
    const [running, setRunning] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [isSuccess, setIsSuccess] = useState(null);
    const editorRef = useRef(null);
    useEffect(() => {
        fetch(`/data/${item.contentFile}`).then(r => r.text()).then(t => setDescriptionHtml(t)).catch(() => setDescriptionHtml("<p>Unable to load description</p>"));
        // load existing draft of code if exists
        const draft = getDraftForExercise(item.id);
        if (draft)
            setCode(draft);
        setDraftLoaded(true);
    }, [item.id]);
    // autosave draft of code on change
    useEffect(() => {
        if (draftLoaded)
            saveDraftForExercise(item.id, code);
    }, [code, draftLoaded]);
    // focus the editor when the component mounts or item changes
    useEffect(() => {
        if (editorRef.current) {
            const editor = editorRef.current.editor;
            if (editor) {
                editor.focus();
                editor.gotoLine(4, 2);
            }
        }
    }, [item.id]);
    async function handleSubmit() {
        setRunning(true);
        setOutput(null);
        setIsSuccess(null);
        if (language === "Python") {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/python", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, tests: item.tests })
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
            const compileRes = await fetch("http://127.0.0.1:8000/api/compile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
            const compileJson = await compileRes.json();
            if (compileJson.error) {
                setOutput(`Compilation error: ${compileJson.error}`);
                setIsSuccess(false);
                setRunning(false);
                return;
            }
            const runRes = await fetch("http://127.0.0.1:8000/api/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: compileJson.token, tests: item.tests }) });
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
    return (_jsxs("div", { className: "grow p-6 flex flex-col", children: [_jsx("div", { className: "max-w-none m-10 learning-container", dangerouslySetInnerHTML: { __html: descriptionHtml ?? "<p>Loading...</p>" } }), _jsxs("div", { className: "flex-1 m-10 flex flex-col", children: [_jsx("div", { className: "border border-border rounded-lg overflow-hidden shadow-sm bg-card", children: _jsx(AceEditor, { ref: editorRef, mode: "c_cpp", theme: "tomorrow_night_eighties", name: "editor", value: code, onChange: (val) => setCode(val), fontSize: 14, width: "100%", height: "400px", showPrintMargin: false, showGutter: true, highlightActiveLine: true, setOptions: {
                                enableBasicAutocompletion: false, // Maybe enable these two for Learn and not for Train
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                useWorker: false,
                                tabSize: 2,
                            } }) }), _jsxs("div", { className: "mt-4 flex items-center gap-3", children: [_jsx("button", { onClick: handleSubmit, disabled: running, className: "px-4 py-2 rounded-md bg-primary-muted text-primary-foreground", children: running ? "Running..." : "Compile and Run" }), _jsx("button", { onClick: () => { setCode(starterCode); }, className: "px-3 py-2 rounded-md border border-border", children: "Reset" })] }), _jsx(OutputFeedback, { output: output, isSuccess: isSuccess })] })] }));
}

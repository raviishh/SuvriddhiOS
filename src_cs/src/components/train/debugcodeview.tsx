import { useEffect, useState } from "react";
import type { DebugCodeDrill } from "../../types/drills";
import { useStore } from "../../store/useStore";
import OutputFeedback from "../common/outputfeedback";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
import { Lightbulb } from "lucide-preact";
import type { LanguageType } from "../../types/language";

export default function DebugCodeView({ drill, onMarkComplete }: { drill: DebugCodeDrill; onMarkComplete: () => void; }) {
    const [language] = useState<LanguageType>("C");
    const { getDraftForDrill, saveDraftForDrill } = useStore();
    const [code, setCode] = useState<string>(drill.buggyCode);
    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        // Load existing draft of code if exists
        const draft = getDraftForDrill(drill.id);
        if (draft) {
            setCode(draft);
        } else {
            setCode(drill.buggyCode);
        }
        setDraftLoaded(true);
        setOutput(null);
        setShowHint(false);
        setIsSuccess(null);
    }, [drill.id]);

    // Autosave draft of code on change
    useEffect(() => {
        if (draftLoaded) saveDraftForDrill(drill.id, code);
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
                    setOutput("Bug fixed! All tests passed!");
                    setIsSuccess(true);
                    onMarkComplete();
                } else {
                    setOutput(`Test failed on the following test case:${json.input === "" ? "" : `\n\nInput: ${json.input}`}\n\nOutput: ${json.output}\n\nExpected: ${json.expected}`);
                    setIsSuccess(false);
                }
            } catch (e: any) {
                setOutput("Runtime error: " + String(e.message ?? e));
                setIsSuccess(false);
            } finally {
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
                setOutput("Bug fixed! All tests passed!");
                setIsSuccess(true);
                onMarkComplete();
            } else {
                setOutput(`Test failed on the following test case:${runJson.input === "" ? "" : `\n\nInput: ${runJson.input}`}\n\nOutput: ${runJson.output}\n\nExpected: ${runJson.expected}`);
                setIsSuccess(false);
            }

        } catch (e: any) {
            setOutput("Runtime error: " + String(e.message ?? e));
            setIsSuccess(false);
        } finally {
            setRunning(false);
        }
    }

    return (
        <div className="grow p-6 flex flex-col">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">{drill.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        drill.difficulty === "easy" ? "bg-green-500/20 text-green-500" :
                        drill.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-500" :
                        "bg-red-500/20 text-red-500"
                    }`}>
                        {drill.difficulty}
                    </span>
                </div>
                <p className="text-muted-foreground mb-4">{drill.description}</p>
                <p className="text-sm text-muted-foreground">Expected Output: <code className="bg-card px-2 py-1 rounded">{drill.expectedOutput}</code></p>
                
                {drill.hint && (
                    <div className="mt-4">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Lightbulb size={16} />
                            {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        {showHint && (
                            <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-md text-sm">
                                💡 {drill.hint}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-card">
                    <AceEditor
                        mode="c_cpp"
                        theme="tomorrow_night_eighties"
                        name="editor"
                        value={code}
                        onChange={(val) => setCode(val)}
                        fontSize={14}
                        width="100%"
                        height="400px"
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            useWorker: false,
                            tabSize: 2,
                        }}
                    />
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={running}
                        className="px-4 py-2 rounded-md bg-primary-muted text-primary-foreground disabled:opacity-50"
                    >
                        {running ? "Running..." : "Test Fix"}
                    </button>
                    <button
                        onClick={() => { setCode(drill.buggyCode); }}
                        className="px-3 py-2 rounded-md border border-border"
                    >
                        Reset
                    </button>
                </div>

                <OutputFeedback
                    output={output}
                    isSuccess={isSuccess}
                    successMessage="Bug fixed!"
                    emptyMessage="No output yet. Test your fix to see results."
                />
            </div>
        </div>
    );
}


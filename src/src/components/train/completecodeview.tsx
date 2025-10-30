import { useEffect, useState } from "react";
import type { CompleteCodeDrill } from "../../types/drills";
import { useStore } from "../../store/useStore";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";

export default function CompleteCodeView({ drill, onMarkComplete }: { drill: CompleteCodeDrill; onMarkComplete: () => void; }) {
    const { getDraftForDrill, saveDraftForDrill } = useStore();
    const [code, setCode] = useState<string>(drill.starterCode);
    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);

    useEffect(() => {
        // Load existing draft of code if exists
        const draft = getDraftForDrill(drill.id);
        if (draft) {
            setCode(draft);
        } else {
            setCode(drill.starterCode);
        }
        setDraftLoaded(true);
        setOutput(null);
    }, [drill.id]);

    // Autosave draft of code on change
    useEffect(() => {
        if (draftLoaded) saveDraftForDrill(drill.id, code);
    }, [code, draftLoaded]);

    async function handleSubmit() {
        setRunning(true);
        setOutput(null);

        try {
            const compileRes = await fetch("http://127.0.0.1:8000/api/compile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });
            const compileJson = await compileRes.json();
            if (compileJson.error) {
                setOutput(`Compilation error: ${compileJson.error}`);
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
                setOutput("✅ Code is correct! All tests passed!");
                onMarkComplete();
            } else {
                setOutput(`❌ Test failed on the following test case:${runJson.input === "" ? "" : `\n\nInput: ${runJson.input}`}\n\nOutput: ${runJson.output}\n\nExpected: ${runJson.expected}`);
            }

        } catch (e: any) {
            setOutput("Runtime error: " + String(e.message ?? e));
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
                <p className="text-muted-foreground">{drill.description}</p>
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
                        {running ? "Running..." : "Submit Solution"}
                    </button>
                    <button
                        onClick={() => { setCode(drill.starterCode); }}
                        className="px-3 py-2 rounded-md border border-border"
                    >
                        Reset
                    </button>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-medium">Output</h3>
                    <pre className="mt-2 p-3 rounded-md bg-card text-foreground h-auto min-h-40 overflow-auto whitespace-pre-wrap">
                        {output ?? "No output yet. Submit your solution to see results."}
                    </pre>
                </div>
            </div>
        </div>
    );
}


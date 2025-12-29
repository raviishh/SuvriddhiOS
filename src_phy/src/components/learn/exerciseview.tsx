import { useEffect, useState } from "react";
import type { ExerciseItem } from "../../types/learningitems";
import { useStore } from "../../store/useStore";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";

export default function ExerciseView({ item, onMarkComplete }: { item: ExerciseItem; onMarkComplete: () => void; }) {

    // No more C code template
    const starterCode = "";

    const { getDraftForExercise, saveDraftForExercise } = useStore();
    const [descriptionHtml, setDescriptionHtml] = useState<string | null>(null);
    const [code, setCode] = useState<string>(starterCode);
    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);



    useEffect(() => {
        fetch(`/data/${item.contentFile}`).then(r => r.text()).then(t => setDescriptionHtml(t)).catch(() => setDescriptionHtml("<p>Unable to load description</p>"));

        // load existing draft of code if exists
        const draft = getDraftForExercise(item.id);
        if (draft) setCode(draft);
        setDraftLoaded(true);
    }, [item.id]);

    // autosave draft of code on change
    useEffect(() => {
        if (draftLoaded) saveDraftForExercise(item.id, code);
    }, [code, draftLoaded]);


    async function handleSubmit() {
        setRunning(true);
        setOutput(null);


        try {
            const compileRes = await fetch("http://127.0.0.1:8000/api/compile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: code }) });
            const compileJson = await compileRes.json();
            if (compileJson.status !== "success") {
                setOutput(`Compilation error: ${compileJson.error}`);
                setRunning(false);
                return;
            }


            const runRes = await fetch("http://127.0.0.1:8000/api/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: compileJson.token, tests: item.tests }) });
            const runJson = await runRes.json();


            if (runJson.status === "success") {
                setOutput("Code is correct. All tests passed!");
                onMarkComplete();
            } else {
                setOutput(`Test failed on case #${runJson.failedCaseIndex}\n\nInput:\n${runJson.input}\n\nExpected:\n${runJson.expected}\n\nOutput:\n${runJson.output}`);
            }


        } catch (e: any) {
            setOutput("Runtime error: " + String(e.message ?? e));
        } finally {
            setRunning(false);
        }
    }
    return (
        <div className="grow p-6 flex flex-col">
            {/* <div className="relative">
                <h2 className="absolute left-1/2 transform -translate-x-2/3 text-3xl font-semibold">{item.title}</h2>
            </div> */}

            <div className="max-w-none m-10" dangerouslySetInnerHTML={{ __html: descriptionHtml ?? "<p>Loading...</p>" }} />


            <div className="flex-1 m-10 flex flex-col">
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
                        enableBasicAutocompletion: false, // Maybe enable these two for Learn and not for Train
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        useWorker: false,
                        tabSize: 2,
                    }}
                />
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <button onClick={handleSubmit} disabled={running} className="px-4 py-2 rounded-md bg-primary-muted text-primary-foreground">{running ? "Running..." : "Compile and Run"}</button>
                    <button onClick={() => { setCode(starterCode); }} className="px-3 py-2 rounded-md border border-border">Reset</button>
                </div>


                <div className="mt-6">
                    <h3 className="text-lg font-medium">Output</h3>
                    <pre className="mt-2 p-3 rounded-md bg-card text-foreground h-40 overflow-auto">{output ?? "No output yet"}</pre>
                </div>
            </div>

        </div>
    );
}
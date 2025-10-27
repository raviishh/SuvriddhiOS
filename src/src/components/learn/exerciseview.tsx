import { useEffect, useState, useRef } from "react";
import type { ExerciseItem } from "../../types/learningitems";
import { useStore } from "../../store/useStore";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";

export default function ExerciseView({ item, onMarkComplete }: { item: ExerciseItem; onMarkComplete: () => void; }) {

    const starterCode = "#include <stdio.h>\nint main() {\n\t\n\t\n\t\n\treturn 0;\n}\n";

    const { getDraftForExercise, saveDraftForExercise } = useStore();
    const [descriptionHtml, setDescriptionHtml] = useState<string | null>(null);
    const [code, setCode] = useState<string>(starterCode);
    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);


    const editorRef = useRef(null);
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

    useEffect(() => {
        const timer = setTimeout(() => {
        editorRef.current?.editor.focus();
        editorRef.current?.editor.gotoLine(1, 0, true);
        }, 100);
        return () => clearTimeout(timer);
    }, [currentFile]);

    async function handleSubmit() {
        setRunning(true);
        setOutput(null);


        try {
            const compileRes = await fetch("http://127.0.0.1:8000/api/compile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
            const compileJson = await compileRes.json();
            if (compileJson.error) {
                setOutput(`Compilation error: ${compileJson.error}`);
                setRunning(false);
                return;
            }


            const runRes = await fetch("http://127.0.0.1:8000/api/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: compileJson.token, tests: item.tests }) });
            const runJson = await runRes.json();


            if (runJson.success) {
                setOutput("Code is correct. All tests passed!");
                onMarkComplete();
            } else {
                setOutput(`Test failed on the following test case:${runJson.input === "" ? "" : `\n\nInput: ${runJson.input}`}\n\nOutput: ${runJson.output}\n\nExpected: ${runJson.expected}`);
            }


        } catch (e: any) {
            setOutput("Runtime error: " + String(e.message ?? e));
        } finally {
            setRunning(false);
        }
    }
    return (
        <div className="learning-container flex flex-col">
            {/* <div className="relative">
                <h2 className="learning-title">{item.title}</h2>
            </div> */}

            <div className="learning-content-exercise" dangerouslySetInnerHTML={{ __html: descriptionHtml ?? "<p>Loading...</p>" }} />

            <div className="exercise-editor-container">
                <div className="exercise-editor">
                    <AceEditor
                        ref={editorRef}
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
                <div className="exercise-buttons">
                    <button onClick={handleSubmit} disabled={running} className="learning-button-secondary">{running ? "Running..." : "Compile and Run"}</button>
                    <button onClick={() => { setCode(starterCode); }} className="learning-button-reset">Reset</button>
                </div>

                <div className="exercise-output-container">
                    <h3 className="exercise-output-title">Output</h3>
                    <pre className="exercise-output">{output ?? "No output yet"}</pre>
                </div>
            </div>

        </div>
    );
}
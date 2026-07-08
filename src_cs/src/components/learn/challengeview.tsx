import { useEffect, useMemo, useRef, useState } from "react";
import type { ChallengeItem } from "../../types/learningitems";
import { useStore } from "../../store/useStore";
import OutputFeedback from "../common/outputfeedback";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";

interface ChallengeData {
    id: string;
    title: string;
    lead: string;
    starterCode: string;
    tasks: {
        taskId: string;
        title: string;
        background: string;
        backgroundCode: string;
        backgroundCodeOutput: string;
        instructions: string[];
        expectedOutput: string;
        hints: string[];
        warnings: string[];
    }[];
}

interface Props {
    item: ChallengeItem;
    challenge: ChallengeData;
    onMarkComplete: () => void;
}

export default function ChallengeView({
    item,
    challenge,
    onMarkComplete,
}: Props) {
    const { language, getDraftForChallenge, saveDraftForChallenge } =
        useStore();

    const task = challenge.tasks[0];

    const descriptionHtml = useMemo(
        () => `
        <h1>${challenge.title}</h1>
        <p>${challenge.lead}</p>

        <h2>${task.title}</h2>
        <p>${task.background}</p>

        <pre><code>${task.backgroundCode}</code></pre>

        ${
            task.backgroundCodeOutput
                ? `<h3>Output</h3><pre>${task.backgroundCodeOutput}</pre>`
                : ""
        }

        <h3>Instructions</h3>
        <ul>
            ${task.instructions.map((i) => `<li>${i}</li>`).join("")}
        </ul>

        <h3>Hints</h3>
        <ul>
            ${task.hints.map((i) => `<li>${i}</li>`).join("")}
        </ul>

        <h3>Warnings</h3>
        <ul>
            ${task.warnings.map((i) => `<li>${i}</li>`).join("")}
        </ul>
    `,
        [challenge],
    );

    const [code, setCode] = useState(challenge.starterCode);
    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    const editorRef = useRef<AceEditor>(null);

    useEffect(() => {
        const draft = getDraftForChallenge(item.id);

        if (draft) {
            setCode(draft);
        } else {
            setCode(challenge.starterCode);
        }

        setDraftLoaded(true);
    }, [item.id, challenge]);

    useEffect(() => {
        if (draftLoaded) {
            saveDraftForChallenge(item.id, code);
        }
    }, [code, draftLoaded]);

    useEffect(() => {
        editorRef.current?.editor.focus();
    }, [item.id]);

    async function handleSubmit() {
        setRunning(true);
        setOutput(null);
        setIsSuccess(null);

        try {
            const endpoint =
                language === "Python"
                    ? "http://127.0.0.1:8000/api/python"
                    : "http://127.0.0.1:8000/api/compile";

            if (language === "Python") {
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code,
                        tests: item.tests,
                    }),
                });

                const json = await res.json();

                if (json.success) {
                    setOutput("All tests passed!");
                    setIsSuccess(true);
                    onMarkComplete();
                } else {
                    setOutput(
                        `Test failed.\n\nOutput: ${json.output}\nExpected: ${json.expected}`,
                    );
                    setIsSuccess(false);
                }
            } else {
                const compile = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                const compileJson = await compile.json();

                if (compileJson.error) {
                    setOutput(compileJson.error);
                    setIsSuccess(false);
                    return;
                }

                const run = await fetch("http://127.0.0.1:8000/api/run", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: compileJson.token,
                        tests: item.tests,
                    }),
                });

                const runJson = await run.json();

                if (runJson.success) {
                    setOutput("All tests passed!");
                    setIsSuccess(true);
                    onMarkComplete();
                } else {
                    setOutput(
                        `Test failed.\n\nOutput: ${runJson.output}\nExpected: ${runJson.expected}`,
                    );
                    setIsSuccess(false);
                }
            }
        } catch (e: any) {
            setOutput(String(e));
            setIsSuccess(false);
        } finally {
            setRunning(false);
        }
    }

    return (
        <div className="grow p-6 flex flex-col">
            <div
                className="learning-container max-w-none m-10"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />

            <div className="m-10 flex flex-col gap-4">
                <AceEditor
                    ref={editorRef}
                    mode={language === "Python" ? "python" : "c_cpp"}
                    theme="tomorrow_night_eighties"
                    width="100%"
                    height="400px"
                    value={code}
                    onChange={setCode}
                    showPrintMargin={false}
                    setOptions={{
                        useWorker: false,
                        tabSize: 4,
                    }}
                />

                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={running}
                        className="px-4 py-2 rounded bg-primary-muted"
                    >
                        {running ? "Running..." : "Compile & Run"}
                    </button>

                    <button
                        onClick={() => setCode(challenge.starterCode)}
                        className="px-4 py-2 border rounded"
                    >
                        Reset
                    </button>
                </div>

                <OutputFeedback output={output} isSuccess={isSuccess} />
            </div>
        </div>
    );
}

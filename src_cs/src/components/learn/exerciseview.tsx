import { useEffect, useMemo, useRef, useState } from "react";
import type { ExerciseItem } from "../../types/learningitems";
import { useStore } from "../../store/useStore";
import OutputFeedback from "../common/outputfeedback";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";

interface ExerciseTest {
    input: string;
    expected: string;
}

interface ExerciseTask {
    taskId: string;
    title: string;
    difficulty: string | null;
    background: string;
    backgroundCode: string;
    backgroundCodeOutput: string;
    instructions: string[];
    expectedOutput: string;
    checkMode: string;
    hints: string[];
    warnings: string[];
    tests: ExerciseTest[];
}
interface ExerciseData {
    id: string;
    title: string;
    lead: string;
    starterCode: string;
    tasks: ExerciseTask[];
}

interface Props {
    item: ExerciseItem;
    onMarkComplete: () => void;
}

export default function ExerciseView({ item, onMarkComplete }: Props) {
    const { language, getDraftForExercise, saveDraftForExercise } = useStore();

    const [exercise, setExercise] = useState<ExerciseData | null>(null);

    const [taskIndex, setTaskIndex] = useState(0);
    const [completedTasks, setCompletedTasks] = useState<boolean[]>([]);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    const [showHints, setShowHints] = useState(false);
    const [showWarnings, setShowWarnings] = useState(false);

    const editorRef = useRef<AceEditor>(null);

    useEffect(() => {
        async function loadExercise() {
            try {
                const res = await fetch("/data/learn/exercises.json");
                const allExercises = await res.json();

                const data = allExercises[item.id];

                if (!data) {
                    throw new Error(`Exercise '${item.id}' not found.`);
                }

                setExercise(data);
                setTaskIndex(0);
                setCompletedTasks(new Array(data.tasks.length).fill(false));
            } catch (err) {
                console.error(err);
                setExercise(null);
            }
        }

        loadExercise();
    }, [item.id]);

    useEffect(() => {
        if (!exercise) return;

        const draft = getDraftForExercise(item.id);

        setCode(draft ?? exercise.starterCode);
        setDraftLoaded(true);
    }, [exercise, item.id]);

    useEffect(() => {
        if (!draftLoaded) return;

        saveDraftForExercise(item.id, code);
    }, [code, draftLoaded]);

    useEffect(() => {
        editorRef.current?.editor.focus();
    }, [item.id]);

    if (!exercise) {
        return (
            <div className="flex-1 flex items-center justify-center">
                Loading exercise...
            </div>
        );
    }

    const task = exercise.tasks[taskIndex];

    const difficultyColor = useMemo(() => {
        switch (task.difficulty) {
            case "stretch":
                return "bg-purple-600";

            case "hard":
                return "bg-red-600";

            case "medium":
                return "bg-yellow-500";

            default:
                return "bg-green-600";
        }
    }, [task]);

    const hasPrevious = taskIndex > 0;
    const hasNext = taskIndex < exercise.tasks.length - 1;
    async function handleSubmit() {
        if (!exercise) return;

        setRunning(true);
        setOutput(null);
        setIsSuccess(null);

        try {
            // const currentTask = exercise.tasks[taskIndex];

            const endpoint =
                language === "Python"
                    ? "http://127.0.0.1:8000/api/python"
                    : "http://127.0.0.1:8000/api/compile";

            if (language === "Python") {
                console.log(task.tests);
                console.log(
                    JSON.stringify(
                        {
                            code,
                            tests: task.tests,
                        },
                        null,
                        2,
                    ),
                );
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        tests: task.tests,
                    }),
                });

                const json = await res.json();

                if (json.success) {
                    setCompletedTasks((prev) => {
                        const next = [...prev];
                        next[taskIndex] = true;
                        return next;
                    });

                    setIsSuccess(true);
                    setOutput("All tests passed!");

                    if (taskIndex === exercise.tasks.length - 1) {
                        onMarkComplete();
                    }

                    return;
                }

                setIsSuccess(false);

                setOutput(
                    `❌ Test Failed

Output:
${json.output}

Expected:
${json.expected}`,
                );
            } else {
                const compile = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                    }),
                });

                const compileJson = await compile.json();

                if (compileJson.error) {
                    setIsSuccess(false);
                    setOutput(compileJson.error);
                    return;
                }

                const run = await fetch("http://127.0.0.1:8000/api/run", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: compileJson.token,
                        tests: task.tests,
                    }),
                });

                const runJson = await run.json();

                if (runJson.success) {
                    setCompletedTasks((prev) => {
                        const next = [...prev];
                        next[taskIndex] = true;
                        return next;
                    });
                    setIsSuccess(true);
                    setOutput("All tests passed!");

                    if (taskIndex === exercise.tasks.length - 1) {
                        onMarkComplete();
                    }
                } else {
                    setIsSuccess(false);

                    setOutput(
                        `❌ Test Failed

Output:
${runJson.output}

Expected:
${runJson.expected}`,
                    );
                }
            }
        } catch (err: any) {
            setIsSuccess(false);
            setOutput(String(err));
        } finally {
            setRunning(false);
        }
    }
    return (
        <div className="grow overflow-y-auto p-8">
            <div className="mx-auto max-w-6xl flex flex-col gap-8">
                {/* Header */}

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold">{exercise.title}</h1>

                    <p className="text-zinc-400 text-lg">{exercise.lead}</p>
                </div>

                {/* Task Card */}

                <div className="rounded-xl border border-zinc-800 bg-zinc-900">
                    <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {task.title}
                            </h2>

                            <p className="text-sm text-zinc-500 mt-1">
                                Task {taskIndex + 1} of {exercise.tasks.length}
                            </p>
                        </div>

                        <div
                            className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${difficultyColor}`}
                        >
                            {task.difficulty ?? "Core"}
                        </div>
                    </div>

                    <div className="p-6 flex flex-col gap-8">
                        {/* Background */}

                        <section>
                            <h3 className="text-xl font-semibold mb-3">
                                Background
                            </h3>

                            <p className="leading-7 text-zinc-300">
                                {task.background}
                            </p>
                        </section>

                        {/* Example */}

                        <section className="space-y-3">
                            <h3 className="text-xl font-semibold">Example</h3>

                            <AceEditor
                                mode={
                                    language === "Python" ? "python" : "c_cpp"
                                }
                                theme="tomorrow_night_eighties"
                                value={task.backgroundCode}
                                readOnly
                                width="100%"
                                height="170px"
                                showPrintMargin={false}
                                setOptions={{
                                    useWorker: false,
                                }}
                            />
                        </section>

                        {/* Output */}

                        {task.backgroundCodeOutput && (
                            <section>
                                <h3 className="text-xl font-semibold mb-3">
                                    Output
                                </h3>

                                <pre className="rounded-lg bg-black p-4 font-mono text-green-400 overflow-x-auto">
                                    {task.backgroundCodeOutput}
                                </pre>
                            </section>
                        )}

                        {/* Instructions */}

                        <section>
                            <h3 className="text-xl font-semibold mb-4">
                                Instructions
                            </h3>

                            <div className="space-y-3">
                                {task.instructions.map((instruction, i) => (
                                    <label
                                        key={i}
                                        className="flex gap-3 items-start"
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-1"
                                        />

                                        <span>{instruction}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Hints */}

                        <section className="rounded-lg border border-zinc-700">
                            <button
                                onClick={() => setShowHints(!showHints)}
                                className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold"
                            >
                                <span>💡 Hints</span>

                                <span>{showHints ? "−" : "+"}</span>
                            </button>

                            {showHints && (
                                <ul className="px-8 pb-5 list-disc space-y-2">
                                    {task.hints.map((hint, i) => (
                                        <li key={i}>{hint}</li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Warnings */}

                        <section className="rounded-lg border border-yellow-700">
                            <button
                                onClick={() => setShowWarnings(!showWarnings)}
                                className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold"
                            >
                                <span>⚠ Warnings</span>

                                <span>{showWarnings ? "−" : "+"}</span>
                            </button>

                            {showWarnings && (
                                <ul className="px-8 pb-5 list-disc space-y-2">
                                    {task.warnings.map((warning, i) => (
                                        <li key={i}>{warning}</li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Expected */}

                        <section>
                            <h3 className="text-xl font-semibold mb-3">
                                Expected Output
                            </h3>

                            <pre className="rounded-lg bg-black p-4 font-mono text-cyan-300 overflow-x-auto">
                                {task.expectedOutput}
                            </pre>
                        </section>
                    </div>
                </div>

                {/* Code Editor */}

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Your Solution
                    </h2>

                    <AceEditor
                        ref={editorRef}
                        mode={language === "Python" ? "python" : "c_cpp"}
                        theme="tomorrow_night_eighties"
                        width="100%"
                        height="420px"
                        value={code}
                        onChange={setCode}
                        showPrintMargin={false}
                        setOptions={{
                            useWorker: false,
                            tabSize: 4,
                        }}
                    />

                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={running}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
                        >
                            {running ? "Running..." : "Compile & Run"}
                        </button>

                        <button
                            onClick={() => setCode(exercise.starterCode)}
                            className="rounded-lg border border-zinc-700 px-5 py-3"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="mt-6">
                        <OutputFeedback output={output} isSuccess={isSuccess} />
                    </div>
                </div>

                {/* Navigation */}

                <div className="flex flex-wrap gap-3">
                    {exercise.tasks.map((t, i) => (
                        <button
                            key={t.taskId}
                            onClick={() => setTaskIndex(i)}
                            className={`rounded-lg px-4 py-2 transition

                        ${
                            i === taskIndex
                                ? "bg-blue-600 text-white"
                                : completedTasks[i]
                                  ? "bg-green-700 text-white"
                                  : "bg-zinc-800 hover:bg-zinc-700"
                        }`}
                        >
                            {completedTasks[i] ? "✓ " : ""}

                            {t.title}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

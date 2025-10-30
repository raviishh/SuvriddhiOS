import { useEffect, useState } from "react";
import type { DetermineOutputDrill } from "../../types/drills";
import { useStore } from "../../store/useStore";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";

export default function DetermineOutputView({ drill, onMarkComplete }: { drill: DetermineOutputDrill; onMarkComplete: () => void; }) {
    const { getDrillAnswer, saveDrillAnswer } = useStore();
    const [userAnswer, setUserAnswer] = useState<string>("");
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        // Load existing answer if exists
        const savedAnswer = getDrillAnswer(drill.id);
        if (savedAnswer) {
            setUserAnswer(savedAnswer);
        } else {
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
            </div>

            <div className="flex-1 flex flex-col gap-6">
                {/* Code Display (Read-only) */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Code to Analyze</h3>
                    <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-card">
                        <AceEditor
                            mode="c_cpp"
                            theme="tomorrow_night_eighties"
                            name="code-viewer"
                            value={drill.code}
                            fontSize={14}
                            width="100%"
                            height="300px"
                            showPrintMargin={false}
                            showGutter={true}
                            highlightActiveLine={false}
                            readOnly={true}
                            setOptions={{
                                useWorker: false,
                                tabSize: 2,
                            }}
                        />
                    </div>
                </div>

                {/* Answer Input */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Your Answer</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        What will this code output? Enter your answer exactly as it would appear.
                    </p>
                    <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={submitted && isCorrect}
                        className="w-full h-32 p-3 rounded-md bg-card border border-border text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        placeholder="Enter the expected output here..."
                    />
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={submitted && isCorrect}
                        className="px-4 py-2 rounded-md bg-primary-muted text-primary-foreground disabled:opacity-50"
                    >
                        {submitted && isCorrect ? "Completed ✓" : "Submit Answer"}
                    </button>
                    {submitted && !isCorrect && (
                        <button
                            onClick={handleReset}
                            className="px-3 py-2 rounded-md border border-border"
                        >
                            Try Again
                        </button>
                    )}
                </div>

                {/* Feedback */}
                {submitted && (
                    <div className={`p-4 rounded-md ${isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                        {isCorrect ? (
                            <div>
                                <p className="text-green-500 font-medium mb-2">✅ Correct!</p>
                                {drill.explanation && (
                                    <p className="text-sm text-muted-foreground">{drill.explanation}</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <p className="text-red-500 font-medium mb-2">❌ Incorrect</p>
                                <p className="text-sm text-muted-foreground mb-2">Your answer:</p>
                                <pre className="bg-card p-2 rounded text-sm mb-2">{userAnswer || "(empty)"}</pre>
                                <p className="text-sm text-muted-foreground mb-2">Correct answer:</p>
                                <pre className="bg-card p-2 rounded text-sm">{drill.correctOutput}</pre>
                                {drill.explanation && (
                                    <p className="text-sm text-muted-foreground mt-2">{drill.explanation}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


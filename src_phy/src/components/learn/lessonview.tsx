import { useEffect, useState, useRef } from "react";
import type { LessonItem } from "../../types/learningitems";
import { Check } from "lucide-react";
import PDFViewer from "../common/PDFViewer";
import { createRoot } from "react-dom/client";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useStore } from "../../store/useStore";

interface LessonViewProps {
    item: LessonItem;
    onMarkComplete: () => void;
}

// ── Physics: one build per level ─────────────────────────────────────────────

function isUnityLesson(contentFile: string) {
    return /G\d+\/index\.html$/.test(contentFile);
}

function UnityPhysicsLesson({ contentFile }: { contentFile: string }) {
    const parts = contentFile.split("/");
    const buildName = parts[1];
    const base = `/data/${parts[0]}/${buildName}/`;

    const { unityProvider } = useUnityContext({
        loaderUrl: `${base}Build/${buildName}.loader.js`,
        dataUrl: `${base}Build/${buildName}.data`,
        frameworkUrl: `${base}Build/${buildName}.framework.js`,
        codeUrl: `${base}Build/${buildName}.wasm`,
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/data/topics/gamelogic/script.js";
        script.async = false;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <>
            <div style={{ height: "30px" }} />
            <h1
                style={{
                    color: "white",
                    fontFamily: "Arial, sans-serif",
                    textAlign: "center",
                    fontSize: "24px",
                }}
            >
                Press R to reset block positions if needed.
            </h1>
            <div style={{ height: "30px" }} />
            <Unity
                unityProvider={unityProvider}
                style={{
                    width: "720px",
                    aspectRatio: "16 / 9",
                    margin: "0 auto",
                }}
            />
            <div style={{ height: "50px" }} />
            <iframe
                src="data/topics/Calc/index.html"
                style={{
                    border: "none",
                    margin: "20px auto",
                    display: "block",
                    height: "400px",
                    width: "600px",
                }}
            />
        </>
    );
}

// ── Math: single shared build, SendMessage with level ID ─────────────────────
function UnityMathLesson({ levelId }: { levelId: string }) {
    const base = `/data/topics_math/`;

    const { unityProvider, sendMessage, isLoaded } = useUnityContext({
        loaderUrl: `${base}Build/Ruby.loader.js`,
        dataUrl: `${base}Build/Ruby.data`,
        frameworkUrl: `${base}Build/Ruby.framework.js`,
        codeUrl: `${base}Build/Ruby.wasm`,
    });

    const sendMessageRef = useRef(sendMessage);
    useEffect(() => {
        sendMessageRef.current = sendMessage;
    }, [sendMessage]);

    useEffect(() => {
        if (!isLoaded) return;
        const t = setTimeout(() => {
            console.log("firing sendMessage via ref");
            sendMessageRef.current("GameLoader", "LoadLevelFromJS", levelId);
        }, 2000);
        return () => clearTimeout(t);
    }, [isLoaded, levelId]);

    return (
        <>
            <div style={{ height: "30px" }} />
            <Unity
                unityProvider={unityProvider}
                style={{
                    width: "720px",
                    aspectRatio: "16 / 9",
                    margin: "0 auto",
                }}
            />
            <div style={{ height: "50px" }} />
            <iframe
                src="data/topics_math/Calc/index.html"
                style={{
                    border: "none",
                    margin: "20px auto",
                    display: "block",
                    height: "400px",
                    width: "600px",
                }}
            />
        </>
    );
}

// ── Main LessonView ───────────────────────────────────────────────────────────

export default function LessonView({ item, onMarkComplete }: LessonViewProps) {
    const { subject } = useStore();
    const [html, setHtml] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const isMathUnity =
        subject === "Math" && item.contentFile === "topics_math/index.html";
    const isPhysicsUnity =
        subject === "Physics" && isUnityLesson(item.contentFile);

    useEffect(() => {
        if (isMathUnity || isPhysicsUnity) return;

        fetch(`/data/${item.contentFile}`)
            .then((r) => r.text())
            .then((t) => {
                setHtml(t);
                setTimeout(() => {
                    if (contentRef.current) {
                        const pdfElements =
                            contentRef.current.getElementsByClassName(
                                "pdf-viewer",
                            );
                        Array.from(pdfElements).forEach((elem) => {
                            const pdfPath = elem.getAttribute("data-pdf");
                            if (pdfPath) {
                                const container = document.createElement("div");
                                elem.parentNode?.replaceChild(container, elem);
                                const root = createRoot(container);
                                root.render(<PDFViewer file={pdfPath} />);
                            }
                        });
                    }
                }, 0);
            })
            .catch(() => setHtml("<p>Unable to load content.</p>"));
    }, [item.contentFile, isMathUnity, isPhysicsUnity]);

    return (
        <div className="grow p-6">
            {isPhysicsUnity ? (
                <UnityPhysicsLesson
                    key={item.contentFile}
                    contentFile={item.contentFile}
                />
            ) : isMathUnity ? (
                <UnityMathLesson key={item.id} levelId={item.id} />
            ) : (
                <div
                    ref={contentRef}
                    className="max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: html ?? "<p>Loading...</p>",
                    }}
                />
            )}

            <div className="flex items-center justify-center mt-4">
                <button
                    onClick={onMarkComplete}
                    className="px-4 py-3 bg-secondary text-primary-foreground rounded-3xl font-medium shadow-md hover:bg-secondary/80 transition-all"
                >
                    <Check />
                </button>
            </div>
        </div>
    );
}

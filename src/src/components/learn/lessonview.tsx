import { useEffect, useState } from "react";
import type { LessonItem } from "../../types/learningitems";
import { Check } from "lucide-react";

interface LessonViewProps {
    item: LessonItem;
    onMarkComplete: () => void;
}

export default function LessonView({ item, onMarkComplete }: LessonViewProps) {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/data/${item.contentFile}`)
            .then(r => r.text())
            .then(t => setHtml(t))
            .catch(() => setHtml("<p>Unable to load content.</p>"));
    }, [item.contentFile]);


    return (
        <div className="learning-container">
            {/* <div className="relative">
                <h2 className="learning-title">{item.title}</h2>
            </div> */}
            {/* <h2 className="learning-title-center"></h2> */}

            {/* Include title with html file for now. Later make it standardized here */}
            <div className="learning-content" dangerouslySetInnerHTML={{ __html: html ?? "<p>Loading...</p>" }} />

            <div className="learning-actions-center">
                <button onClick={onMarkComplete} className="learning-button-primary"><Check /></button>
            </div>
        </div>
    );
}
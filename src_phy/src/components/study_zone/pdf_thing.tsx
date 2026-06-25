import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #0f0f0f;
  color: #e8e4dc;
  font-family: 'DM Mono', monospace;
}

.learn {
  display: flex;
  height: 100vh;
  width: 100%;
}

.sidebar {
  width: 260px;
  border-right: 1px solid #222;
  padding: 2rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.sidebar-title {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}

.book-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.book-btn {
  background: none;
  border: 1px solid #2a2a2a;
  color: #666;
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-size: 0.75rem;
  text-align: left;
  transition: all 0.18s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.book-btn:hover {
  border-color: #e8e4dc;
  color: #e8e4dc;
  background: #171717;
}

.book-btn.active {
  border-color: #e8e4dc;
  color: #e8e4dc;
  background: #1a1a1a;
}

.viewer-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-header {
  height: 54px;
  border-bottom: 1px solid #222;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #555;
  flex-shrink: 0;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.page-btn {
  background: none;
  border: 1px solid #2a2a2a;
  color: #666;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  transition: all 0.18s;
}

.page-btn:hover:not(:disabled) {
  border-color: #e8e4dc;
  color: #e8e4dc;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.viewer-frame {
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  background: #141414;
}

.placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  font-size: 0.8rem;
}

.react-pdf__Document {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.react-pdf__Page {
  box-shadow: 0 4px 24px rgba(0,0,0,0.5);
}
`;

export default function LearnPage() {
    const [pdf, setPdf] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const books = [
        {
            name: "Chemistry: Atoms First 2e",
            path: "/pdfs/pdfs/ChemistryAtomsFirst2e-WEB.pdf",
        },
        { name: "Chemistry 2e", path: "/pdfs/pdfs/Chemistry2e-WEB.pdf" },
        { name: "Physics", path: "/pdfs/pdfs/Physics-WEB_Sab7RrQ.pdf" },
        {
            name: "College Physics for AP Courses 2e",
            path: "/pdfs/pdfs/College_Physics_for_AP_Courses_2e-WEB_DkhNbxV.pdf",
        },
        {
            name: "College Physics 2e",
            path: "/pdfs/pdfs/College_Physics_2e-WEB_7Zesafu.pdf",
        },
        { name: "Precalculus 2e", path: "/pdfs/pdfs/Precalculus_2e-WEB.pdf" },
        {
            name: "Prealgebra 2e",
            path: "/pdfs/pdfs/Prealgebra2e-WEB_0qbw93r.pdf",
        },
        {
            name: "Intermediate Algebra 2e",
            path: "/pdfs/pdfs/IntermediateAlgebra2e-WEB_RlpFLLx.pdf",
        },
        {
            name: "Elementary Algebra 2e",
            path: "/pdfs/pdfs/ElementaryAlgebra2e-WEB_3zxfu3Z.pdf",
        },
        {
            name: "College Algebra Corequisite Support 2e",
            path: "/pdfs/pdfs/College-Algebra-Corequisite-Support-2e-WEB.pdf",
        },
        {
            name: "College Algebra 2e",
            path: "/pdfs/pdfs/College-Algebra-2e-WEB.pdf",
        },
        {
            name: "Algebra and Trigonometry 2e",
            path: "/pdfs/pdfs/Algebra-and-Trigonometry-2e-WEB.pdf",
        },
        { name: "Algebra 1", path: "/pdfs/pdfs/Algebra_1_-_WEB-2.pdf" },
        { name: "Statistics", path: "/pdfs/pdfs/Statistics-WEB.pdf" },
    ];

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const [displayPage, setDisplayPage] = useState(1);
    const targetPage = useRef(pageNumber);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const dir =
                e.key === "ArrowRight" || e.key === "ArrowDown"
                    ? 1
                    : e.key === "ArrowLeft" || e.key === "ArrowUp"
                      ? -1
                      : 0;
            if (!dir) return;
            targetPage.current = Math.min(
                Math.max(targetPage.current + dir, 1),
                numPages,
            );
            setDisplayPage(targetPage.current);
        }

        function handleKeyUp(e: KeyboardEvent) {
            const isNav = [
                "ArrowRight",
                "ArrowDown",
                "ArrowLeft",
                "ArrowUp",
            ].includes(e.key);
            if (!isNav) return;
            setPageNumber(targetPage.current);
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [numPages]);

    useEffect(() => {
        targetPage.current = pageNumber;
        setDisplayPage(pageNumber);
    }, [pageNumber]);

    function selectBook(path: string) {
        setPdf(path);
        setNumPages(0);
        setPageNumber(1);
    }

    return (
        <>
            <style>{STYLES}</style>
            <div className="learn">
                <div className="sidebar">
                    <div className="sidebar-title">Reference Library</div>
                    <div className="book-grid">
                        {books.map((book) => (
                            <button
                                key={book.path}
                                className={`book-btn ${pdf === book.path ? "active" : ""}`}
                                onClick={() => selectBook(book.path)}
                            >
                                {book.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="viewer-container">
                    <div className="viewer-header">
                        <span>
                            {pdf
                                ? pdf.split("/").pop()
                                : "No document selected"}
                        </span>
                        {numPages > 0 && (
                            <div className="page-controls">
                                <button
                                    className="page-btn"
                                    disabled={pageNumber <= 1}
                                    onClick={() => setPageNumber((p) => p - 1)}
                                >
                                    ←
                                </button>
                                <span>
                                    {displayPage} / {numPages}
                                </span>
                                <button
                                    className="page-btn"
                                    disabled={displayPage >= numPages}
                                    onClick={() => setPageNumber((p) => p + 1)}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="viewer-frame">
                        {pdf ? (
                            <Document
                                file={pdf}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="placeholder">
                                        Loading...
                                    </div>
                                }
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </Document>
                        ) : (
                            <div className="placeholder">
                                Select a document from the library
                            </div>
                        )}
                    </div>
                </div>
                <a
                    href="/"
                    data-discover="true"
                    style={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        zIndex: 50,
                        display: "inline-flex",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                </a>
            </div>
        </>
    );
}

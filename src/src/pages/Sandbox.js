import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import { ChevronLeft, ChevronRight, Home } from "lucide-preact";
import { Link } from "preact-router/match";
export default function Sandbox() {
    const [language] = useState("C");
    let starterCode = "";
    if (language === "Python") {
        starterCode = "print('Hello, World!')\n";
    }
    else {
        starterCode = "#include <stdio.h>\nint main() {\n\t\n\t\n\t\n\treturn 0;\n}\n";
    }
    const [code, setCode] = useState(starterCode);
    const [output, setOutput] = useState("");
    const [status, setStatus] = useState("Idle");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [fileTokens, setFileTokens] = useState({});
    const [currentFile, setCurrentFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const editorRef = useRef(null);
    async function handleFileList() {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/list");
            const json = await res.json();
            setFileList(json.files || []);
            if (json.files.length && !currentFile) {
                setCurrentFile(json.files[0]);
                loadFile(json.files[0]);
            }
        }
        catch (err) {
            console.error("Error fetching file list", err);
        }
    }
    async function loadFile(filename) {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/load", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename }),
            });
            const json = await res.json();
            setCode(json.code || starterCode);
            setCurrentFile(filename);
        }
        catch (err) {
            console.error("Error loading file", err);
            setCode(starterCode);
        }
    }
    async function saveFile(filename, content) {
        try {
            await fetch("http://127.0.0.1:8000/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename, code: content }),
            });
            if (!fileList.includes(filename))
                handleFileList();
        }
        catch (err) {
            console.error("Error saving file", err);
        }
    }
    async function handleCompile() {
        if (!currentFile)
            return;
        setStatus("Compiling...");
        setOutput("");
        setFileTokens(prev => ({ ...prev, [currentFile]: null }));
        try {
            const compileRes = await fetch("http://127.0.0.1:8000/api/compile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const compileJson = await compileRes.json();
            if (compileJson.error)
                throw new Error(compileJson.error || "Compile failed");
            setStatus("Compiled Successfully");
            setFileTokens(prev => ({ ...prev, [currentFile]: compileJson.token }));
            return compileJson.token;
        }
        catch (err) {
            setOutput(`Error: ${err.message}`);
            setStatus("Error");
        }
    }
    async function handleRun(runToken) {
        if (!runToken)
            return;
        setStatus("Running...");
        setOutput("");
        try {
            const runRes = await fetch("http://127.0.0.1:8000/api/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: runToken, tests: [] }),
            });
            const runJson = await runRes.json();
            if (!runJson.success)
                throw new Error(runJson.error || "Runtime Error");
            setOutput(runJson.output);
            setStatus("Done");
        }
        catch (err) {
            setOutput(`Error: ${err.message}`);
            setStatus("Error");
        }
    }
    async function handleCompileAndRun() {
        if (language === "Python") {
            if (!code)
                return;
            setStatus("Running...");
            setOutput("");
            try {
                const res = await fetch("http://127.0.0.1:8000/api/python", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code,
                        tests: [] // sandbox: explicitly empty
                    }),
                });
                const json = await res.json();
                if (!json.success) {
                    throw new Error(json.error || "Runtime Error");
                }
                setOutput(json.output ?? "");
                setStatus("Done");
            }
            catch (e) {
                setOutput(`Error: ${e.message ?? String(e)}`);
                setStatus("Error");
            }
            return;
        }
        if (language === "C") {
            const runToken = await handleCompile();
            await handleRun(runToken);
        }
    }
    useEffect(() => {
        if (currentFile) {
            const timer = setTimeout(() => {
                saveFile(currentFile, code);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [code, currentFile]);
    useEffect(() => {
        handleFileList();
    }, []);
    // focus the editor when a file is loaded
    useEffect(() => {
        if (editorRef.current && currentFile) {
            const editor = editorRef.current.editor;
            if (editor) {
                editor.focus();
                editor.gotoLine(4, 2);
            }
        }
    }, [currentFile]);
    if (!currentFile)
        return _jsx(_Fragment, {});
    return (_jsxs("div", { className: "flex h-screen bg-background text-foreground", children: [sidebarOpen && (_jsxs("div", { className: "w-48 bg-card border-r border-border flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border", children: [_jsx("h2", { className: "text-sm font-semibold", children: "My Programs" }), _jsx("button", { onClick: () => setSidebarOpen(false), className: "opacity-70 hover:opacity-100", children: _jsx(ChevronLeft, { size: 20 }) })] }), _jsxs("div", { className: "flex-1 p-2 overflow-auto", children: [_jsx("div", { className: "mb-2", children: _jsx("button", { className: "w-full bg-primary text-primary-foreground px-2 py-1 rounded hover:opacity-90 text-xs", onClick: async () => {
                                        const input = prompt("Enter new filename:");
                                        if (!input)
                                            return;
                                        const filename = input.endsWith(".c") ? input.slice(0, -2) : input;
                                        await fetch("http://127.0.0.1:8000/api/save", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ filename, code: starterCode }),
                                        });
                                        await handleFileList();
                                        setCurrentFile(filename);
                                        setCode(starterCode);
                                    }, children: "+ New File" }) }), fileList.map((f) => (_jsx("button", { className: `block w-full text-left text-sm py-1 px-2 rounded hover:bg-muted ${currentFile === f ? "bg-muted" : ""}`, onClick: () => loadFile(f), children: f + ".c" }, f)))] })] })), _jsxs("div", { className: "flex flex-1 flex-col relative", children: [_jsxs("div", { className: "bg-card border-b border-border px-4 py-2 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [!sidebarOpen && (_jsx("button", { onClick: () => setSidebarOpen(true), className: "bg-card rounded hover:bg-secondary hover:text-foreground transition-colors", children: _jsx(ChevronRight, { size: 20 }) })), _jsx(Link, { href: "/", className: "bg-card rounded px-1 py-1 text-xs hover:bg-secondary hover:text-foreground transition-colors", children: _jsx(Home, { size: 16 }) }), _jsx("h1", { className: "font-semibold text-sm opacity-90", children: currentFile ? currentFile + ".c" : "No file selected" })] }), _jsx("span", { className: "text-xs opacity-60", children: status })] }), _jsx("div", { className: "flex-1", children: _jsx(AceEditor, { ref: editorRef, mode: "c_cpp", theme: "tomorrow_night_eighties", name: "editor", width: "100%", height: "100%", value: code, onChange: (val) => setCode(val), fontSize: 14, showPrintMargin: false, showGutter: true, highlightActiveLine: true, setOptions: {
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: false,
                                useWorker: false,
                                tabSize: 2,
                            } }) }), _jsx("div", { className: "bg-card border-t border-border p-2 flex items-center justify-between", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: handleCompile, className: "text-primary-foreground px-3 py-1 rounded hover:opacity-90", children: "Compile" }), _jsx("button", { disabled: fileTokens[currentFile] == null, onClick: () => handleRun(fileTokens[currentFile]), className: `${fileTokens[currentFile] == null ? "text-muted-foreground" : "text-foreground hover:opacity-90"} px-3 py-1 rounded `, children: "Run" }), _jsx("button", { onClick: handleCompileAndRun, className: "bg-primary-muted text-secondary-foreground px-3 py-1 rounded hover:opacity-90", children: "Compile & Run" })] }) })] }), _jsxs("div", { className: "w-120 bg-card border-l border-border flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border", children: [_jsx("h2", { className: "text-sm font-semibold", children: "Output" }), _jsx("button", { onClick: () => setOutput(""), className: "text-xs opacity-70 hover:opacity-100", children: "Clear" })] }), _jsx("div", { className: "flex-1 p-4 overflow-auto text-xs font-mono bg-card" // Maybe change the color here
                        , children: output ? (_jsx("pre", { className: "whitespace-pre-wrap leading-relaxed", children: output
                                .split("\n")
                                .map((line, i) => (_jsxs("span", { className: "text-foreground", children: [line, "\n"] }, i))) })) : (_jsx("div", { className: "opacity-60 text-center mt-10", children: "No output yet" })) })] })] }));
}

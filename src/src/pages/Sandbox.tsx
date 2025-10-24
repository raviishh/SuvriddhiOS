import { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Link } from "react-router";

export default function Sandbox() {
  const starterCode = "#include <stdio.h>\nint main() {\n\t\n\t\n\t\n\treturn 0;\n}\n";

  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Idle");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState("hello.c");

  const dummyFiles = ["hello.c", "sum.c", "loops.c"];

  async function handleCompile() {
    setStatus("Compiling...");
    setOutput("");
    setToken(null);
    
    try {
      const compileRes = await fetch("http://127.0.0.1:8000/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const compileJson = await compileRes.json();

      if (compileJson.status !== "success") throw new Error(compileJson.error || "Compile failed");

      setStatus("Compiled Successfully");

      setToken(compileJson.token);

    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
      setStatus("Error");
    }
  }

  async function handleRun() {
    if (!token) return;

    setStatus("Running...");
    setOutput("");

    try {
      const runRes = await fetch("http://127.0.0.1:8000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, tests: [] }),
      });

      const runJson = await runRes.json();

      if (runJson.status !== "success") throw new Error(runJson.error || "Run failed");

      setOutput(runJson.output);
      setStatus("Done");

    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
      setStatus("Error");
    }
  }

  async function handleCompileAndRun() {
    await handleCompile();
    await handleRun();
  }

  return (
    <div className="flex h-screen bg-background text-foreground">

      {/* Currently dummy codes are running -> Needs to be setup */}
      {sidebarOpen && (
        <div className="w-48 bg-card border-r border-border flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <h2 className="text-sm font-semibold">My Programs</h2>
            <button onClick={() => setSidebarOpen(false)} className="opacity-70 hover:opacity-100">
              <ChevronLeft size={20}/>
            </button>
          </div>
          <div className="flex-1 p-2 overflow-auto">
            {dummyFiles.map((f) => (
              <button
                key={f}
                className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-muted ${
                  currentFile === f ? "bg-muted" : ""
                }`}
                onClick={() => {
                  setCurrentFile(f);
                  setCode(`${starterCode}`);
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}





      <div className="flex flex-1 flex-col relative">

        <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)} className="bg-card rounded hover:bg-accent hover:text-accent-foreground transition-colors">
                <ChevronRight size={20}/>
              </button>
            )}

            <Link to="/" className="bg-card rounded px-1 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition-colors">
              <Home size={16} />
            </Link>

            <h1 className="font-semibold text-sm opacity-90">{currentFile}</h1>

          </div>
          <span className="text-xs opacity-60">{status}</span>
        </div>

        <div className="flex-1">
          <AceEditor
            mode="c_cpp"
            theme="tomorrow_night_eighties"
            name="editor"
            width="100%"
            height="100%"
            value={code}
            onChange={(val) => setCode(val)}
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                useWorker: false,
                tabSize: 2,
            }}
          />
        </div>


        <div className="bg-card border-t border-border p-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleCompile}
              className="bg-accent text-primary-foreground px-3 py-1 rounded hover:opacity-90"
            >
              Compile
            </button>
            <button
              onClick={handleRun}
              className="bg-accent text-accent-foreground px-3 py-1 rounded hover:opacity-90"
            >
              Run
            </button>
            <button
              onClick={handleCompileAndRun}
              className="bg-primary-muted text-secondary-foreground px-3 py-1 rounded hover:opacity-90"
            >
              Compile & Run
            </button>
          </div>
        </div>
      </div>

      <div className="w-120 bg-card border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <h2 className="text-sm font-semibold">Output</h2>
          <button
            onClick={() => setOutput("")}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Clear
          </button>
        </div>

        <div
          className="flex-1 p-4 overflow-auto text-xs font-mono bg-card" // Maybe change the color here
        >
          {output ? (
            <pre className="whitespace-pre-wrap leading-relaxed">
              {output
                .split("\n")
                .map((line, i) => (
                  <span key={i} className="text-foreground">
                    {line}
                    {"\n"}
                  </span>
                ))}
            </pre>
          ) : (
            <div className="opacity-60 text-center mt-10">No output yet</div>
          )}
        </div>
      </div>

    </div>
  );
}

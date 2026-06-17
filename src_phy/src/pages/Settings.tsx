import { Wifi, Home, Power, RotateCcw, RefreshCw, History } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Settings() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"idle" | "updating" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const handlePower = async (cmd: string) => {
        await fetch("http://localhost:8000/api/power", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cmd }),
        });
    };

    const handleUpdate = async () => {
        setStatus("updating");
        try {
            const res = await fetch("http://localhost:8000/api/updates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            if (!res.ok) {
                const data = await res.json();
                setErrorMsg(data.error ?? "Unknown error");
                setStatus("error");
            }
            // if res.ok we never get here — device rebooted
        } catch {
            // fetch threw — likely device rebooted mid-request, ignore
        }
    };

    const handleRollback = async () => {
        try {
            await fetch("http://localhost:8000/api/rollback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
        } catch {
            // rebooted
        }
    };

    return (
        <div className="p-10 max-w-2xl mx-auto text-white font-sans mb-16">
            <h1 className="text-2xl font-semibold mb-6 pb-2 border-b border-slate-800">
                Settings
            </h1>

            <div className="flex flex-col divide-y divide-slate-800">
                <button
                    onClick={() => navigate("/settings/wifi")}
                    className="flex items-center justify-between py-4 hover:bg-slate-900/50 px-2 rounded-lg transition-colors group text-left"
                >
                    <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <span className="text-slate-200 group-hover:text-white font-medium">
                            Wi-Fi
                        </span>
                    </div>
                    <span className="text-slate-500 group-hover:text-slate-300 text-sm transition-colors">
                        Configure network &rarr;
                    </span>
                </button>

                <button
                    onClick={() => handlePower("restart")}
                    className="flex items-center justify-between py-4 hover:bg-slate-900/50 px-2 rounded-lg transition-colors group text-left"
                >
                    <div className="flex items-center gap-3">
                        <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <span className="text-slate-200 group-hover:text-white font-medium">
                            Restart
                        </span>
                    </div>
                    <span className="text-slate-500 group-hover:text-slate-300 text-sm transition-colors">
                        Reboot system &rarr;
                    </span>
                </button>

                <button
                    onClick={() => handlePower("shutdown")}
                    className="flex items-center justify-between py-4 hover:bg-slate-900/50 px-2 rounded-lg transition-colors group text-left"
                >
                    <div className="flex items-center gap-3">
                        <Power className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                        <span className="text-slate-200 group-hover:text-white font-medium">
                            Shutdown
                        </span>
                    </div>
                    <span className="text-slate-500 group-hover:text-slate-300 text-sm transition-colors">
                        Power off &rarr;
                    </span>
                </button>

                <button
                    onClick={() => handleUpdate()}
                    className="flex items-center justify-between py-4 hover:bg-slate-900/50 px-2 rounded-lg transition-colors group text-left"
                >
                    <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                        <span className="text-slate-200 group-hover:text-white font-medium">
                            Update
                        </span>
                    </div>
                    <span className="text-slate-500 group-hover:text-slate-300 text-sm transition-colors">
                        Continue to Update &rarr;
                    </span>
                </button>

                <button
                    onClick={() => handleRollback()}
                    className="flex items-center justify-between py-4 hover:bg-slate-900/50 px-2 rounded-lg transition-colors group text-left"
                >
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                        <span className="text-slate-200 group-hover:text-white font-medium">
                            Rollback (Undo) Update
                        </span>
                    </div>
                    <span className="text-slate-500 group-hover:text-slate-300 text-sm transition-colors">
                        Continue to Rollback &rarr;
                    </span>
                </button>

                {status === "updating" && (
                    <p className="text-slate-400 text-sm px-2 pt-2">
                        Starting system update...
                    </p>
                )}
                {status === "error" && (
                    <p className="text-red-400 text-sm px-2 pt-2">{errorMsg}</p>
                )}
            </div>

            <a
                href="/"
                className="fixed bottom-6 left-6 text-slate-200 hover:text-white rounded-lg p-2.5 flex items-center justify-center"
                aria-label="Home"
            >
                <Home size={18} />
            </a>
        </div>
    );
}

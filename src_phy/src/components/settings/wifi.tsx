import { useState } from "react";
import { Home } from "lucide-react";

export default function WifiSetup() {
    const [ssid, setSsid] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:8080/api/wifi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ssid, pass }),
            });
            const data = await res.json();
            if (data.success) {
                window.location.href = "/";
            } else {
                setError(data.error || "Unknown error");
            }
        } catch {
            setError("Failed to reach backend");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 text-center text-white flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">WiFi Login</h1>
            <p className="text-sm text-gray-400">
                Suvriddhi OS doesn't require WiFi to run but it is recommended
                to access a wider array of content.
            </p>
            <input
                className="bg-[#181818] text-white border border-gray-600 p-2 rounded w-128 placeholder-gray-500"
                placeholder="Enter SSID (WiFi Name)"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
            />
            <input
                className="bg-[#181818] text-white border border-gray-600 p-2 rounded w-128 placeholder-gray-500"
                placeholder="Enter WPA Passphrase (WiFi password)"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
                className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleConnect}
                disabled={loading}
            >
                {loading ? "Connecting..." : "Connect"}
            </button>
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

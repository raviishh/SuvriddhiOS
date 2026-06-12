import { useState } from "react";

export default function WifiSetup() {
    const [ssid, setSsid] = useState("");
    const [pass, setPass] = useState("");

    const handleConnect = async () => {
        await fetch("http://localhost:8080/api/wifi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ssid, password: pass }),
        });
        window.location.href = "/";
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
                value={pass}
                onChange={(e) => setPass(e.target.value)}
            />
            <button
                className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700 transition-colors"
                onClick={handleConnect}
            >
                Connect
            </button>
        </div>
    );
}

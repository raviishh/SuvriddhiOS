import { Wifi, Home } from "lucide-react";

export default function Settings() {
    return (
        <div className="p-10 max-w-2xl mx-auto text-white font-sans mb-16">
            {/* Page Title */}
            <h1 className="text-2xl font-semibold mb-6 pb-2 border-b border-slate-800">
                Settings
            </h1>

            {/* Settings Options List */}
            <div className="flex flex-col divide-y divide-slate-800">
                <button
                    onClick={() => (window.location.href = "/settings/wifi")}
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

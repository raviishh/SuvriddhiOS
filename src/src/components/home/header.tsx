import { Settings } from "lucide-react";
import { Link } from "react-router";

export default function Header() {
    return (
        <div className="border-b border-border backdrop-blur-sm">
            <div className="mx-auto max-w-7xl py-4 px-8">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo.jpg" alt="SuvriddhiOS Logo" className="h-10 w-10 mr-2 rounded-lg"/>
                    <h1 className="text-xl">SuvriddhiOS</h1>
                </div>


                <Link to={"/settings"}>
                    <button className="rounded-lg p-2 hover:bg-secondary transition-colors">
                        <Settings size={20} />
                    </button>
                </Link>

                </div>
            </div>
        </div>
    )
}
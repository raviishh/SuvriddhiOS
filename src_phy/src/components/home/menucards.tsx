import { BicepsFlexed, BookOpen, Code2 } from "lucide-react";
import { Link } from "react-router";

const buttons = [
    { id: 0, title: "Learn", desc: "Explore interactive physics simulations and lessons", icon: <BookOpen size={32} />, to: "/learn" },
    { id: 1, title: "Achievements", desc: "Track your progress and unlock rewards", icon: <BicepsFlexed size={32} />, to: "/achievements" },
    { id: 2, title: "Notes", desc: "Take and organize your study notes", icon: <Code2 size={32} />, to: "/notes" },
];

export default function MenuCards() {
    return (
        <div className="grid gap-6 grid-cols-3">
            {buttons.map((item) => (
                <Link to={item.to} key={item.id} className="menu-card">
                    <div className="menu-card-content">
                        <div className="mb-4 text-4xl">{item.icon}</div>
                        <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
import { BicepsFlexed, BookOpen, Code2 } from "lucide-react";
import { Link } from "react-router";

const buttons = [
    { id: 0, title: "Learn", desc: "Learn with structured lessons and exercises", icon: <BookOpen size={32} />, to: "/learn" },
    { id: 1, title: "Train", desc: "Practice additional drills to strengthen your skills", icon: <BicepsFlexed size={32} />, to: "/train" },
    { id: 2, title: "Sandbox", desc: "Experiment freely with code", icon: <Code2 size={32} />, to: "/sandbox" },
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
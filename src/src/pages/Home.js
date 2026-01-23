import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import Header from "../components/home/header";
import LanguageSelector from "../components/home/languageselector";
import MenuCards from "../components/home/menucards";
import RecentActivity from "../components/home/recentactivity";
export default function Home() {
    const { language, setLanguage, lastActivity, setLastActivity, markItemCompleted, isItemCompleted } = useStore();
    const [topics, setTopics] = useState([]);
    let path = "/data/learn/topics.json";
    useEffect(() => {
        if (language === "C") {
            path = "/data/learn/topics.json";
        }
        else if (language === "Python") {
            path = "/data/learn/topics_py.json";
        }
        fetch(path)
            .then(r => r.json())
            .then((t) => setTopics(t))
            .catch(() => setTopics([]));
    }, []);
    useEffect(() => {
        if (lastActivity) {
            localStorage.setItem("lastActivity", JSON.stringify(lastActivity));
        }
    }, [lastActivity]);
    useEffect(() => {
        if (topics.length === 0)
            return;
        const savedCompletedItems = localStorage.getItem("completedItems");
        if (savedCompletedItems) {
            const completedItems = JSON.parse(savedCompletedItems);
            completedItems.forEach(item => {
                if (!isItemCompleted(item.itemId))
                    markItemCompleted(item.itemId);
            });
        }
        const savedLast = localStorage.getItem("lastActivity");
        if (savedLast && !lastActivity) {
            setLastActivity(JSON.parse(savedLast));
        }
    }, [topics, lastActivity, markItemCompleted, isItemCompleted, setLastActivity]);
    if (lastActivity)
        return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col text-foreground font-display", children: [_jsx(Header, {}), _jsxs("div", { className: "mx-auto grow flex flex-col max-w-7xl py-12 px-8", children: [_jsxs("section", { children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight text-balance", children: "Welcome back!" }), _jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "Select Your Programming Language" }), _jsx(LanguageSelector, { newUser: false, language: language, setLanguage: setLanguage })] }), _jsxs("div", { className: "flex flex-col grow justify-center mt-12 space-y-16", children: [_jsxs("section", { children: [_jsx("h2", { className: "mb-6 text-2xl font-semibold", children: "Main Menu" }), _jsx(MenuCards, {})] }), _jsx("section", { children: _jsx(RecentActivity, { lastActivity: lastActivity }) })] })] })] }));
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col text-foreground font-display", children: [_jsx(Header, {}), _jsxs("div", { className: "mx-auto grow flex flex-col items-center justify-center max-w-7xl py-16 px-8", children: [_jsxs("section", { className: "text-center", children: [_jsx("h1", { className: "text-6xl font-bold tracking-tight text-balance mb-8", children: "Welcome to SuvriddhiOS!" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Choose your programming language to get started" }), _jsx(LanguageSelector, { newUser: true, language: language, setLanguage: setLanguage })] }), _jsx("section", { className: "mt-32", children: _jsx(MenuCards, {}) })] })] }));
}

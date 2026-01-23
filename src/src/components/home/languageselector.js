import { jsx as _jsx } from "preact/jsx-runtime";
export default function LanguageSelector({ language, setLanguage, newUser }) {
    return (_jsx("div", { className: `flex items-center ${newUser ? "justify-center" : ""} mt-6 gap-4 rounded-lg bg-background p-1`, children: ["C", "Python"].map((lang) => (_jsx("button", { onClick: () => setLanguage(lang), className: `px-5 py-2.5 text-sm rounded-md transition-colors ${language === lang
                ? "bg-primary-muted text-primary-foregroundZ"
                : "text-muted-foreground bg-card hover:text-foreground hover:bg-secondary"}`, children: lang }, lang))) }));
}

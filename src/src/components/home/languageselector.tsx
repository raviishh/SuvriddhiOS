import type { LanguageType } from "../../types/language";

interface LanguageSelectorProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  newUser: boolean;
}

export default function LanguageSelector({ language, setLanguage, newUser }: LanguageSelectorProps) {
    return (
        <div className={`flex items-center ${newUser ? "justify-center" : ""} mt-6 gap-4 rounded-lg bg-background p-1`}>
            {(["C", "C++", "Java", "Python"] as const).map((lang) => (
              <button
                key={lang}
                disabled={language != lang} /*Remove this line when other languages are supported*/
                onClick={() => setLanguage(lang)}
                className={`px-5 py-2.5 text-sm rounded-md transition-colors ${
                  language === lang
                    ? "bg-primary-muted text-primary-foregroundZ"
                    : "text-muted-foreground bg-card hover:text-foreground hover:bg-secondary"
                }`}
              >
                {lang}
              </button>
            ))}
        </div>
    )
}
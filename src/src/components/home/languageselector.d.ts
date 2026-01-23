import type { LanguageType } from "../../types/language";
interface LanguageSelectorProps {
    language: LanguageType;
    setLanguage: (lang: LanguageType) => void;
    newUser: boolean;
}
export default function LanguageSelector({ language, setLanguage, newUser }: LanguageSelectorProps): import("preact").JSX.Element;
export {};

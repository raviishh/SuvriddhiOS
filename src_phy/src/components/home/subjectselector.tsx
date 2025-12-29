import type { SubjectType } from "../../types/language";

interface SubjectSelectorProps {
  subject: SubjectType;
  setSubject: (lang: SubjectType) => void;
  newUser: boolean;
}

export default function SubjectSelector({ subject, setSubject, newUser }: SubjectSelectorProps) {
    return (
        <div className={`flex items-center ${newUser ? "justify-center" : ""} mt-6 gap-4 rounded-lg bg-background p-1`}>
            {(["Physics", "Chemistry", "Math"] as const).map((subj) => (
              <button
                key={subj}
                onClick={() => setSubject(subj)}
                className={`px-5 py-2.5 text-sm rounded-md transition-colors ${
                  subject === subj
                    ? "bg-primary-muted text-primary-foregroundZ"
                    : "text-muted-foreground bg-card hover:text-foreground hover:bg-secondary"
                }`}
              >
                {subj}
              </button>
            ))}
        </div>
    )
}
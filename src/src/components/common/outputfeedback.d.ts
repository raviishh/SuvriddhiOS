interface OutputFeedbackProps {
    output: string | null;
    isSuccess: boolean | null;
    successMessage?: string;
    errorMessage?: string;
    emptyMessage?: string;
}
export default function OutputFeedback({ output, isSuccess, successMessage, errorMessage, emptyMessage }: OutputFeedbackProps): import("preact").JSX.Element;
export {};

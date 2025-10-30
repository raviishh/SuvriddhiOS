interface OutputFeedbackProps {
    output: string | null;
    isSuccess: boolean | null;
    successMessage?: string;
    errorMessage?: string;
    emptyMessage?: string;
}

export default function OutputFeedback({
    output,
    isSuccess,
    successMessage = "Code is correct!",
    errorMessage = "Error",
    emptyMessage = "No output yet. Run your code to see results."
}: OutputFeedbackProps) {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Output</h3>
            {output ? (
                <div className={`p-4 rounded-md ${isSuccess ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                    <p className={`font-medium mb-2 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                        {isSuccess ? `✅ ${successMessage}` : `❌ ${errorMessage}`}
                    </p>
                    <pre className="text-sm text-foreground whitespace-pre-wrap">{output}</pre>
                </div>
            ) : (
                <div className="p-4 rounded-md bg-card border border-border">
                    <p className="text-muted-foreground">{emptyMessage}</p>
                </div>
            )}
        </div>
    );
}


export type DrillType = "complete-code" | "debug-code" | "determine-output";

export interface BaseDrill {
    id: string;
    type: DrillType;
    title: string;
    difficulty: "easy" | "medium" | "hard";
}

export interface Test {
    input: string;
    expected: string;
}

// Complete the Code: User fills in missing parts of code
export interface CompleteCodeDrill extends BaseDrill {
    type: "complete-code";
    description: string;
    starterCode: string; // Code with blanks marked as /* YOUR CODE HERE */
    solution: string; // Complete solution for reference
    tests: Test[];
}

// Debug the Code: User fixes errors in provided code
export interface DebugCodeDrill extends BaseDrill {
    type: "debug-code";
    description: string;
    buggyCode: string; // Code with intentional bugs
    expectedOutput: string; // What the code should output when fixed
    hint?: string; // Optional hint about the bug
    tests: Test[];
}

// Determine Output: User predicts what code will output
export interface DetermineOutputDrill extends BaseDrill {
    type: "determine-output";
    description: string;
    code: string; // Code to analyze (read-only)
    correctOutput: string; // The correct output
    explanation?: string; // Optional explanation shown after answer
}

export type Drill = CompleteCodeDrill | DebugCodeDrill | DetermineOutputDrill;

export interface DrillCategory {
    id: string;
    title: string;
    drills: Drill[];
}

export interface ActiveDrill {
    categoryId: string;
    drillId: string;
}


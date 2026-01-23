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
export interface CompleteCodeDrill extends BaseDrill {
    type: "complete-code";
    description: string;
    starterCode: string;
    solution: string;
    tests: Test[];
}
export interface DebugCodeDrill extends BaseDrill {
    type: "debug-code";
    description: string;
    buggyCode: string;
    expectedOutput: string;
    hint?: string;
    tests: Test[];
}
export interface DetermineOutputDrill extends BaseDrill {
    type: "determine-output";
    description: string;
    code: string;
    correctOutput: string;
    explanation?: string;
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

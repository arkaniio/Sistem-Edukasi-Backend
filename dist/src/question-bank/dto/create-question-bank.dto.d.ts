export declare enum DifficultyLevel {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}
export declare class CreateQuestionBankDto {
    title: string;
    description?: string;
    difficulty?: DifficultyLevel;
    subjectId?: string;
}

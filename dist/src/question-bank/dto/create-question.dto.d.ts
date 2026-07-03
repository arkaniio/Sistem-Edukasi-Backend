export declare enum QuestionType {
    MCQ = "MCQ",
    ESSAY = "ESSAY",
    TRUE_FALSE = "TRUE_FALSE",
    MULTI_SELECT = "MULTI_SELECT"
}
export declare class CreateOptionDto {
    label: string;
    text: string;
    isCorrect?: boolean;
}
export declare class CreateQuestionDto {
    question: string;
    type: QuestionType;
    explanation?: string;
    score?: number;
    order?: number;
    tags?: string[];
    imageUrl?: string;
    options?: CreateOptionDto[];
}

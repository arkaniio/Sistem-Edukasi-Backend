import { OptionService } from './option.service';
export declare class OptionController {
    private readonly optionService;
    constructor(optionService: OptionService);
    create(dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        text: string;
        isCorrect: boolean;
        questionId: string;
    }>;
}

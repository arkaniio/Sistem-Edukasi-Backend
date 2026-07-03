import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    findAll(search?: string): Promise<({
        _count: {
            questionBanks: number;
            quizzes: number;
            classes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            questionBanks: number;
            quizzes: number;
            classes: number;
        };
        classes: ({
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: string | null;
            };
            teacher: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            classId: string;
            subjectId: string;
            teacherId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
    }>;
    create(dto: CreateSubjectDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
    }>;
    update(id: string, dto: UpdateSubjectDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
    }>;
}

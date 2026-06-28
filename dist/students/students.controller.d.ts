import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    findAll(): Promise<({
        class: {
            id: string;
            name: string;
        };
    } & {
        firstName: string;
        lastName: string;
        classId: string;
        id: string;
        userId: string | null;
    })[]>;
    create(data: CreateStudentDto): Promise<{
        firstName: string;
        lastName: string;
        classId: string;
        id: string;
        userId: string | null;
    }>;
    update(id: string, data: UpdateStudentDto): Promise<{
        firstName: string;
        lastName: string;
        classId: string;
        id: string;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        firstName: string;
        lastName: string;
        classId: string;
        id: string;
        userId: string | null;
    }>;
}

import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    findAll(): Promise<({
        _count: {
            students: number;
        };
    } & {
        id: string;
        name: string;
    })[]>;
    create(data: CreateClassDto): Promise<{
        id: string;
        name: string;
    }>;
    update(id: string, data: UpdateClassDto): Promise<{
        id: string;
        name: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
    }>;
}

import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    findAll(): any;
    create(data: any): any;
    update(id: string, data: any): any;
    remove(id: string): any;
}

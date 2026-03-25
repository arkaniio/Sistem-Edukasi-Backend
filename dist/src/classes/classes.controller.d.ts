import { ClassesService } from './classes.service';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    findAll(): Promise<any>;
    create(data: any): any;
    update(id: string, data: any): any;
    remove(id: string): any;
}

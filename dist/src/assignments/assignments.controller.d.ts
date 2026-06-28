import { AssignmentsService } from './assignments.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AssignmentsController {
    private readonly assignmentsService;
    private prisma;
    constructor(assignmentsService: AssignmentsService, prisma: PrismaService);
    findAll(req: any): any;
    fetchSubmissions(id: string): Promise<any>;
    submitAssignment(id: string, data: any, req: any): Promise<any>;
    gradeSubmission(submissionId: string, data: any): Promise<any>;
    create(data: any, req: any): Promise<any>;
    update(id: string, data: any): any;
    remove(id: string): any;
}

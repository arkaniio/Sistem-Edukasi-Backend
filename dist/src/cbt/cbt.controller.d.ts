import { CbtService } from './cbt.service';
export declare class CbtController {
    private readonly cbtService;
    constructor(cbtService: CbtService);
    findAll(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(req: any, data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
    addQuestion(id: string, data: any): Promise<any>;
    updateQuestion(qid: string, data: any): Promise<any>;
    removeQuestion(qid: string): Promise<any>;
    startAttempt(req: any, id: string): Promise<any>;
    submitAttempt(req: any, aid: string, body: {
        answers: any;
    }): Promise<any>;
    getAttempts(id: string): Promise<any>;
    gradeAttempt(aid: string, body: any): Promise<any>;
}

import { TestsService } from './tests.service';
export declare class TestsController {
    private readonly testsService;
    constructor(testsService: TestsService);
    getTests(req: any): Promise<any>;
    createTest(body: any, req: any): Promise<any>;
}

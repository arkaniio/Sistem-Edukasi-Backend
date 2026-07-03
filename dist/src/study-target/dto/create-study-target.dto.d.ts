import { StudyTargetPeriod } from '@prisma/client';
export declare class CreateStudyTargetDto {
    title: string;
    description?: string;
    period: StudyTargetPeriod;
}

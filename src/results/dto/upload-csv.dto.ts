import { IsNotEmpty, IsString } from 'class-validator';

export class UploadCsvDto {
  @IsString()
  @IsNotEmpty()
  classId!: string;

  @IsString()
  @IsNotEmpty()
  subjectId!: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  accessLevel!: string;

  @IsString()
  @IsNotEmpty()
  classSubjectId!: string;
}

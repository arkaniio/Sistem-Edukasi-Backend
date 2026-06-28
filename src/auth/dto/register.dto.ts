import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  IsIn,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty()
  password!: string;

  @IsIn(['STUDENT', 'TEACHER'])
  role!: 'STUDENT' | 'TEACHER';

  @IsOptional()
  @IsString()
  classId?: string;
}

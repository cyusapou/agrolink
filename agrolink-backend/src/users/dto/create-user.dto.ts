import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { AppRole } from '../../auth/roles.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(AppRole)
  role: AppRole;

  @IsString()
  phone: string;

  cooperativeId?: number;
}

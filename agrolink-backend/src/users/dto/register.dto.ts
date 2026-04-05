import { IsEmail, IsEnum, IsString, MinLength, IsOptional } from 'class-validator';
import { AppRole } from '../../auth/roles.decorator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(AppRole)
  role: AppRole;

  @IsString()
  phone: string;

  // For COOP_MANAGER role - cooperative creation
  @IsOptional()
  @IsString()
  cooperativeName?: string;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  momoNumber?: string;

  // For BUYER role
  @IsOptional()
  @IsString()
  businessName?: string;
}

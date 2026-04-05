import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFarmerDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  cooperativeId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


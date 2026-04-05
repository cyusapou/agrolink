import { IsNumber, IsString, Min } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  phoneNumber: string;

  @IsNumber()
  @Min(1)
  amount: number;
}


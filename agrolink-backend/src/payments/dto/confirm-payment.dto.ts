import { IsNumber, IsString, Min } from 'class-validator';

export class ConfirmPaymentDto {
  @IsString()
  externalId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}


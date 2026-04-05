import { IsNumber, IsString, IsOptional, IsDate, Min, Max } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @Min(0.1)
  quantityKg: number;

  @IsNumber()
  @Min(1)
  produceId: number;

  @IsString()
  deliveryAddress: string;

  @IsOptional()
  @IsDate()
  expectedDeliveryDate?: Date;
}

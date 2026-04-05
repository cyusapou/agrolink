export class UpdatePaymentDto {
  status?: 'pending' | 'confirmed' | 'failed';
  amount?: number;
  phoneNumber?: string;
  mtnResponse?: unknown;
  callbackBody?: unknown;
}

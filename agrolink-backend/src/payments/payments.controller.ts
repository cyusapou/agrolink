import { Controller, Get, Post, Body, Param, Patch, HttpStatus, Logger, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { Roles, AppRole } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

// Define DTOs inline since they might not exist
class InitiatePaymentDto {
  phoneNumber: string;
  amount: number;
}

class ConfirmPaymentDto {
  externalId: string;
  amount: number;
}

class UpdatePaymentDto {
  status?: 'pending' | 'confirmed' | 'failed';
  amount?: number;
  phoneNumber?: string;
  mtnResponse?: unknown;
  callbackBody?: unknown;
}

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(AppRole.ADMIN)
  @Post('initiate')
  async initiatePayment(@Body() body: InitiatePaymentDto) {
    const response = await this.paymentsService.initiatePayment(
      body.phoneNumber,
      body.amount,
    );

    return {
      status: 'success',
      data: response,
    };
  }

  @Roles(AppRole.ADMIN)
  @Post('confirm')
  confirmPayment(@Body() body: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(body.externalId, body.amount);
  }

  @Get(':externalId')
  trackPayment(@Param('externalId') externalId: string) {
    return this.paymentsService.trackPayment(externalId);
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id')
  updatePayment(
    @Param('id') id: string,
    @Body() body: UpdatePaymentDto,
  ) {
    return this.paymentsService.updatePayment(Number(id), body);
  }

  // This endpoint is called automatically by MTN MoMo servers after processing payment.
  // Your frontend/mobile app should not call this directly in normal flow.
  @Public()
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  handleCallback(@Body() callbackBody: unknown) {
    this.logger.log(`MTN callback received: ${JSON.stringify(callbackBody)}`);
    return this.paymentsService.processCallback(callbackBody);
  }
}


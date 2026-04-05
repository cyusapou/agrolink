import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles('admin')
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

  @Roles('admin')
  @Post('confirm')
  confirmPayment(@Body() body: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(body.externalId, body.amount);
  }

  @Get(':externalId')
  trackPayment(@Param('externalId') externalId: string) {
    return this.paymentsService.trackPayment(externalId);
  }

  @Roles('admin')
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


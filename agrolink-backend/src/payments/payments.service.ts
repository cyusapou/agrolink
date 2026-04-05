import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async initiatePayment(phoneNumber: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }

    const externalId = Date.now().toString();

    const payload = {
      amount: amount.toString(),
      currency: 'RWF',
      externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber,
      },
      payerMessage: 'AgroLink Payment',
      payeeNote: 'Order Payment',
    };

    const headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_API_KEY ?? '',
      'X-Target-Environment': 'sandbox',
    };

    const response$ = this.httpService.post(
      'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
      payload,
      { headers },
    );

    try {
      const response = await lastValueFrom(response$);
      const payment = this.paymentRepository.create({
        externalId,
        phoneNumber,
        amount,
        status: 'pending',
        mtnResponse: response.data,
        callbackBody: null,
      });
      await this.paymentRepository.save(payment);
      return { externalId, status: 'pending', mtn: response.data };
    } catch (error) {
      const payment = this.paymentRepository.create({
        externalId,
        phoneNumber,
        amount,
        status: 'failed',
        mtnResponse: error,
        callbackBody: null,
      });
      await this.paymentRepository.save(payment);
      throw error;
    }
  }

  async confirmPayment(externalId: string, amount: number) {
    const payment = await this.paymentRepository.findOne({
      where: { externalId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.amount !== amount) {
      throw new BadRequestException(
        'Payment amount mismatch with initiated transaction',
      );
    }

    payment.status = 'confirmed';
    await this.paymentRepository.save(payment);
    return payment;
  }

  async trackPayment(externalId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { externalId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updatePayment(id: number, payload: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payload.status) {
      payment.status = payload.status;
    }
    if (payload.amount !== undefined) {
      payment.amount = payload.amount;
    }
    if (payload.phoneNumber) {
      payment.phoneNumber = payload.phoneNumber;
    }
    if (payload.mtnResponse !== undefined) {
      payment.mtnResponse = payload.mtnResponse;
    }
    if (payload.callbackBody !== undefined) {
      payment.callbackBody = payload.callbackBody;
    }

    return this.paymentRepository.save(payment);
  }

  async processCallback(callbackBody: unknown) {
    const externalId = this.extractExternalId(callbackBody);

    if (!externalId) {
      return { statusCode: 200, message: 'Callback received' };
    }

    const payment = await this.paymentRepository.findOne({
      where: { externalId },
    });

    if (!payment) {
      return { statusCode: 200, message: 'Callback received for unknown payment' };
    }

    payment.callbackBody = callbackBody;
    if (this.extractFailure(callbackBody)) {
      payment.status = 'failed';
    } else if (payment.status !== 'confirmed') {
      payment.status = 'pending';
    }

    await this.paymentRepository.save(payment);
    return { statusCode: 200, message: 'Callback received' };
  }

  private extractExternalId(body: unknown): string | undefined {
    if (!body || typeof body !== 'object') {
      return undefined;
    }
    const typed = body as Record<string, unknown>;
    const direct = typed.externalId;
    if (typeof direct === 'string') return direct;
    const data = typed.data;
    if (data && typeof data === 'object') {
      const nested = (data as Record<string, unknown>).externalId;
      if (typeof nested === 'string') return nested;
    }
    return undefined;
  }

  private extractFailure(body: unknown): boolean {
    if (!body || typeof body !== 'object') {
      return false;
    }
    const typed = body as Record<string, unknown>;
    const status = typed.status;
    return typeof status === 'string' && status.toLowerCase().includes('fail');
  }
}


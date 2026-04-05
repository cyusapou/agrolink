import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';

@Module({
  // HttpModule gives PaymentsService access to HttpService for MTN API calls.
  imports: [HttpModule, TypeOrmModule.forFeature([Payment])],
  // Register the REST endpoints for payment initiation and callbacks.
  controllers: [PaymentsController],
  // Register the business logic for integrating with MTN MoMo.
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

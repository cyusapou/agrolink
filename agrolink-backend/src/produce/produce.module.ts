import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produce } from './produce.entity';
import { ProduceController } from './produce.controller';
import { ProduceService } from './produce.service';
import { Farmer } from '../farmers/farmer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produce, Farmer])],
  controllers: [ProduceController],
  providers: [ProduceService],
})
export class ProduceModule {}


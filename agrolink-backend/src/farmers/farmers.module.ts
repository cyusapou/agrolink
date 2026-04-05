import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from './farmer.entity';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { Cooperative } from '../cooperatives/cooperative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer, Cooperative])],
  controllers: [FarmersController],
  providers: [FarmersService],
})
export class FarmersModule {}


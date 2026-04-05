import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Produce } from './produce.entity';
import { ProduceController } from './produce.controller';
import { ProduceService } from './produce.service';
import { Farmer } from '../farmers/farmer.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produce, Farmer, User]), JwtModule.register({})],
  controllers: [ProduceController],
  providers: [ProduceService],
})
export class ProduceModule {}


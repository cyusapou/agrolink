import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Farmer } from './farmer.entity';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { Cooperative } from '../cooperatives/cooperative.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer, Cooperative, User]), JwtModule.register({})],
  controllers: [FarmersController],
  providers: [FarmersService],
})
export class FarmersModule {}


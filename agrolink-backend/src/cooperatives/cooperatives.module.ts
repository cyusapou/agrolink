import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cooperative } from './cooperative.entity';
import { CooperativesController } from './cooperatives.controller';
import { CooperativesService } from './cooperatives.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cooperative])],
  controllers: [CooperativesController],
  providers: [CooperativesService],
})
export class CooperativesModule {}


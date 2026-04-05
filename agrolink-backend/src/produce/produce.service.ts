import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produce } from './produce.entity';
import { Farmer } from '../farmers/farmer.entity';
import { CreateProduceDto } from './dto/create-produce.dto';
import { UpdateProduceDto } from './dto/update-produce.dto';

@Injectable()
export class ProduceService {
  constructor(
    @InjectRepository(Produce)
    private readonly produceRepository: Repository<Produce>,
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
  ) {}

  findAll(): Promise<Produce[]> {
    return this.produceRepository.find({
      relations: ['farmer', 'farmer.cooperative'],
    });
  }

  async create(payload: CreateProduceDto): Promise<Produce> {
    if (payload.quantity < 0) {
      throw new BadRequestException('Produce quantity cannot be negative');
    }

    if (payload.price < 0) {
      throw new BadRequestException('Produce price cannot be negative');
    }

    const farmer = await this.farmerRepository.findOne({
      where: { id: payload.farmerId },
    });
    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    const produce = this.produceRepository.create({
      name: payload.name,
      description: payload.description,
      quantity: payload.quantity,
      price: payload.price,
      farmer,
      isActive: payload.isActive ?? true,
    });

    return this.produceRepository.save(produce);
  }

  async update(id: number, payload: UpdateProduceDto): Promise<Produce> {
    const produce = await this.produceRepository.findOne({
      where: { id },
      relations: ['farmer'],
    });

    if (!produce) {
      throw new NotFoundException('Produce not found');
    }

    if (payload.farmerId) {
      const farmer = await this.farmerRepository.findOne({
        where: { id: payload.farmerId },
      });
      if (!farmer) {
        throw new NotFoundException('Farmer not found');
      }
      produce.farmer = farmer;
    }

    if (typeof payload.quantity === 'number' && payload.quantity < 0) {
      throw new BadRequestException('Produce quantity cannot be negative');
    }

    if (typeof payload.price === 'number' && payload.price < 0) {
      throw new BadRequestException('Produce price cannot be negative');
    }

    const updated = this.produceRepository.merge(produce, payload);
    return this.produceRepository.save(updated);
  }

  async softDelete(id: number): Promise<void> {
    const produce = await this.produceRepository.findOne({ where: { id } });
    if (!produce) {
      throw new NotFoundException('Produce not found');
    }

    produce.isActive = false;
    await this.produceRepository.save(produce);
  }

  async getTotalsByCooperative() {
    const rows = await this.produceRepository
      .createQueryBuilder('produce')
      .innerJoin('produce.farmer', 'farmer')
      .innerJoin('farmer.cooperative', 'cooperative')
      .select('cooperative.id', 'cooperativeId')
      .addSelect('cooperative.name', 'cooperativeName')
      .addSelect('COALESCE(SUM(produce.quantity), 0)', 'totalProduceKg')
      .addSelect('COALESCE(SUM(produce.quantity * produce.price), 0)', 'revenue')
      .groupBy('cooperative.id')
      .addGroupBy('cooperative.name')
      .getRawMany<{
        cooperativeId: string;
        cooperativeName: string;
        totalProduceKg: string;
        revenue: string;
      }>();

    return rows.map((row) => ({
      cooperativeId: Number(row.cooperativeId),
      cooperativeName: row.cooperativeName,
      totalProduceKg: Number(row.totalProduceKg),
      revenue: Number(row.revenue),
    }));
  }
}


import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produce } from './produce.entity';
import { Farmer } from '../farmers/farmer.entity';
import { User } from '../users/entities/user.entity';
import { CreateProduceDto } from './dto/create-produce.dto';
import { UpdateProduceDto } from './dto/update-produce.dto';

@Injectable()
export class ProduceService {
  constructor(
    @InjectRepository(Produce)
    private readonly produceRepository: Repository<Produce>,
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Produce[]> {
    return this.produceRepository.find({
      relations: ['farmer', 'farmer.cooperative'],
    });
  }

  async create(payload: CreateProduceDto, userId?: number): Promise<Produce> {
    if (payload.quantity < 0) {
      throw new BadRequestException('Produce quantity cannot be negative');
    }

    if (payload.price < 0) {
      throw new BadRequestException('Produce price cannot be negative');
    }

    let farmer;
    
    // If userId is provided (cooperative manager), find a farmer for their cooperative
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['cooperative'],
      });
      
      if (!user || !user.cooperative) {
        throw new NotFoundException('User or cooperative not found');
      }
      
      // Find any farmer from this cooperative
      farmer = await this.farmerRepository.findOne({
        where: { cooperative: { id: user.cooperative.id } },
      });
      
      if (!farmer) {
        throw new NotFoundException('No farmer found for this cooperative. Please add a farmer first.');
      }
    } else {
      // Public case - use provided farmerId or find first available farmer
      if (payload.farmerId) {
        farmer = await this.farmerRepository.findOne({
          where: { id: payload.farmerId },
        });
        if (!farmer) {
          throw new NotFoundException('Farmer not found');
        }
      } else {
        // Auto-assign to first available farmer
        farmer = await this.farmerRepository.findOne({ 
          where: { isActive: true },
          order: { id: 'ASC' } 
        });
        if (!farmer) {
          throw new BadRequestException('No active farmers available. Please add a farmer first.');
        }
      }
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

  async update(id: number, payload: UpdateProduceDto, userId?: number): Promise<Produce> {
    const produce = await this.produceRepository.findOne({
      where: { id },
      relations: ['farmer', 'farmer.cooperative'],
    });

    if (!produce) {
      throw new NotFoundException('Produce not found');
    }

    // If userId is provided, check if user belongs to the same cooperative
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['cooperative'],
      });
      
      if (!user || !user.cooperative) {
        throw new NotFoundException('User or cooperative not found');
      }
      
      // Check if the produce belongs to the user's cooperative
      if (produce.farmer.cooperative.id !== user.cooperative.id) {
        throw new NotFoundException('You can only update produce from your own cooperative');
      }
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


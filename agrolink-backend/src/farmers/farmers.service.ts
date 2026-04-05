import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmer } from './farmer.entity';
import { Cooperative } from '../cooperatives/cooperative.entity';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
    @InjectRepository(Cooperative)
    private readonly cooperativeRepository: Repository<Cooperative>,
  ) {}

  findAll(): Promise<Farmer[]> {
    return this.farmerRepository.find({ relations: ['cooperative'] });
  }

  async create(payload: CreateFarmerDto): Promise<Farmer> {
    const duplicate = await this.farmerRepository.findOne({
      where: { email: payload.email },
    });
    if (duplicate) {
      throw new ConflictException('A farmer with this email already exists');
    }

    // Auto-assignment rule: if no cooperativeId is provided,
    // assign farmer to the first active cooperative.
    let cooperativeId = payload.cooperativeId;
    if (!cooperativeId) {
      const fallbackCooperative = await this.cooperativeRepository.findOne({
        where: { isActive: true },
        order: { id: 'ASC' },
      });

      if (!fallbackCooperative) {
        throw new NotFoundException(
          'No active cooperative found for automatic assignment',
        );
      }
      cooperativeId = fallbackCooperative.id;
    }

    const cooperative = await this.cooperativeRepository.findOne({
      where: { id: cooperativeId },
    });
    if (!cooperative) {
      throw new NotFoundException('Cooperative not found');
    }

    const farmer = this.farmerRepository.create({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      cooperative: cooperative as Cooperative,
      isActive: payload.isActive ?? true,
    });

    return this.farmerRepository.save(farmer);
  }

  async update(id: number, payload: UpdateFarmerDto): Promise<Farmer> {
    const farmer = await this.farmerRepository.findOne({
      where: { id },
      relations: ['cooperative'],
    });

    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    if (payload.email && payload.email !== farmer.email) {
      const existing = await this.farmerRepository.findOne({
        where: { email: payload.email },
      });
      if (existing) {
        throw new ConflictException('A farmer with this email already exists');
      }
    }

    if (payload.cooperativeId) {
      const cooperative = await this.cooperativeRepository.findOne({
        where: { id: payload.cooperativeId },
      });
      if (!cooperative) {
        throw new NotFoundException('Cooperative not found');
      }
      farmer.cooperative = cooperative;
    }

    const updated = this.farmerRepository.merge(farmer, payload);
    return this.farmerRepository.save(updated);
  }

  async softDelete(id: number): Promise<void> {
    const farmer = await this.farmerRepository.findOne({ where: { id } });
    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    farmer.isActive = false;
    await this.farmerRepository.save(farmer);
  }
}


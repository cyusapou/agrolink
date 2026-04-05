import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cooperative } from './cooperative.entity';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';

@Injectable()
export class CooperativesService {
  constructor(
    @InjectRepository(Cooperative)
    private readonly cooperativeRepository: Repository<Cooperative>,
  ) {}

  findAll(): Promise<Cooperative[]> {
    return this.cooperativeRepository.find();
  }

  async create(payload: CreateCooperativeDto): Promise<Cooperative> {
    const existing = await this.cooperativeRepository.findOne({
      where: { email: payload.email },
    });

    if (existing) {
      throw new ConflictException('A cooperative with this email already exists');
    }

    const cooperative = this.cooperativeRepository.create({
      ...payload,
      isActive: payload.isActive ?? true,
    });
    return this.cooperativeRepository.save(cooperative);
  }

  async update(id: number, payload: UpdateCooperativeDto): Promise<Cooperative> {
    const cooperative = await this.cooperativeRepository.findOne({
      where: { id },
    });

    if (!cooperative) {
      throw new NotFoundException('Cooperative not found');
    }

    if (payload.email && payload.email !== cooperative.email) {
      const existing = await this.cooperativeRepository.findOne({
        where: { email: payload.email },
      });
      if (existing) {
        throw new ConflictException('A cooperative with this email already exists');
      }
    }

    const updated = this.cooperativeRepository.merge(cooperative, payload);
    return this.cooperativeRepository.save(updated);
  }

  async softDelete(id: number): Promise<void> {
    const cooperative = await this.cooperativeRepository.findOne({
      where: { id },
    });

    if (!cooperative) {
      throw new NotFoundException('Cooperative not found');
    }

    cooperative.isActive = false;
    await this.cooperativeRepository.save(cooperative);
  }
}


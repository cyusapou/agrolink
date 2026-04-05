import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { AppRole } from '../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { Cooperative } from '../cooperatives/cooperative.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cooperative)
    private cooperativeRepository: Repository<Cooperative>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
    });

    return this.userRepository.save(user);
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    let cooperative: Cooperative | null = null;

    // Create cooperative if registering as COOP_MANAGER
    if (registerDto.role === AppRole.COOP_MANAGER) {
      if (!registerDto.cooperativeName || !registerDto.managerName || !registerDto.phone) {
        throw new ConflictException('Cooperative details are required for cooperative manager registration');
      }

      cooperative = this.cooperativeRepository.create({
        name: registerDto.cooperativeName,
        managerName: registerDto.managerName,
        phone: registerDto.phone,
        email: registerDto.email,
        isActive: true,
      });

      cooperative = await this.cooperativeRepository.save(cooperative);
    }

    const user = this.userRepository.create({
      email: registerDto.email,
      passwordHash,
      role: registerDto.role,
      phone: registerDto.phone,
      cooperative: cooperative || undefined,
      isActive: true,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['cooperative'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['cooperative'],
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

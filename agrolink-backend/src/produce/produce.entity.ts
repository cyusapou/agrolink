import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Farmer } from '../farmers/farmer.entity';

@Entity()
export class Produce {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('float')
  quantity: number;

  @Column('float')
  price: number;

  @ManyToOne(() => Farmer, { nullable: false })
  farmer: Farmer;

  @Column({ default: true })
  isActive: boolean;
}


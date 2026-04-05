import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cooperative } from '../cooperatives/cooperative.entity';

@Entity()
export class Farmer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Cooperative, { nullable: false })
  cooperative: Cooperative;

  @Column({ default: true })
  isActive: boolean;
}


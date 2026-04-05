import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Order } from '../orders/entities/order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  externalId: string;

  @Column()
  phoneNumber: string;

  @Column('float')
  amount: number;

  @Column()
  status: 'pending' | 'confirmed' | 'failed';

  @ManyToOne(() => Order, { nullable: true })
  order: Order;

  @Column({ type: 'json', nullable: true })
  mtnResponse?: unknown;

  @Column({ type: 'json', nullable: true })
  callbackBody?: unknown;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

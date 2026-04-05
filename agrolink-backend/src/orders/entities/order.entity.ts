import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Produce } from '../../produce/produce.entity';
import { Cooperative } from '../../cooperatives/cooperative.entity';
import { Payment } from '../../payments/payment.entity';

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAYMENT_HELD = 'PAYMENT_HELD',
  CONFIRMED = 'CONFIRMED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  buyer: User;

  @ManyToOne(() => Produce, { eager: true })
  produce: Produce;

  @ManyToOne(() => Cooperative, { eager: true })
  cooperative: Cooperative;

  @Column('float')
  quantityKg: number;

  @Column('float')
  unitPrice: number; // snapshot at time of order

  @Column('float')
  totalAmount: number; // quantityKg * unitPrice

  @Column('float')
  platformFee: number; // totalAmount * 0.03

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING_PAYMENT })
  status: OrderStatus;

  @Column()
  deliveryAddress: string;

  @Column({ nullable: true })
  expectedDeliveryDate: Date;

  @OneToOne(() => Payment, { nullable: true })
  payment: Payment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

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

  @Column({ type: 'json', nullable: true })
  mtnResponse?: unknown;

  @Column({ type: 'json', nullable: true })
  callbackBody?: unknown;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cooperative } from '../../cooperatives/cooperative.entity';
import { AppRole } from '../../auth/roles.decorator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string; // bcrypt — NEVER plain text

  @Column({ type: 'enum', enum: AppRole })
  role: AppRole;

  @Column()
  phone: string;

  @ManyToOne(() => Cooperative, { nullable: true })
  cooperative: Cooperative;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cooperative {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  managerName: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;
}


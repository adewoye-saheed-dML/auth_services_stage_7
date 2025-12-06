import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prefix: string;

  @Column()
  hash: string;

  // NEW: Allows you to turn off a key without deleting it
  @Column({ default: true })
  isActive: boolean;

  // NEW: Optional expiration date
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.apiKeys)
  user: User;
}
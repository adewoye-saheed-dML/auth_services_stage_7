import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prefix: string; // e.g. "sk_live_..."

  @Column()
  hash: string;   // Hashed version

  // NEW: Store the service name
  @Column({ nullable: true }) 
  serviceName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.apiKeys)
  user: User;
}
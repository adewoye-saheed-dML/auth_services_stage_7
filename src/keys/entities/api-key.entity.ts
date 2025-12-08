import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prefix: string; // e.g., "sk_live_..."

  @Column()
  hash: string;   // Hashed version of the key

  // Stores the name of the service (e.g., "Billing App")
  @Column({ nullable: true }) 
  serviceName: string;

  // Revocation: Allows "soft delete"
  @Column({ default: true })
  isActive: boolean;

  // Expiration: When the key stops working
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.apiKeys)
  user: User;
}
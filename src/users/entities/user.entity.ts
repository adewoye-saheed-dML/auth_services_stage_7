import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiKey } from '../../keys/entities/api-key.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(ApiKey) private repo: Repository<ApiKey>,
  ) {}

  async createKey(user: User) {
    // 1. Generate the raw key
    const rawKey = 'sk_live_' + crypto.randomBytes(20).toString('hex');
    
    // 2. Hash it
    const hash = await bcrypt.hash(rawKey, 10);

    // 3. Set Expiration (e.g., 30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // 4. Create the record
    const apiKey = this.repo.create({
      prefix: rawKey.substring(0, 10),
      hash: hash,
      user: user,
      isActive: true, // Default to active
      expiresAt: expiresAt,
    });

    await this.repo.save(apiKey);

    // 5. Return raw key + expiration date
    return {
      apiKey: rawKey,
      expiresAt: expiresAt,
      message: 'Save this key now. It will not be shown again.',
    };
  }

  async validateApiKey(rawKey: string) {
    const prefix = rawKey.substring(0, 10);
    
    const keyRecord = await this.repo.findOne({
      where: { prefix },
      relations: ['user'],
    });

    // Check 1: Does key exist?
    if (!keyRecord) {
      return null;
    }

    // Check 2: Is it Revoked? (isActive must be true)
    if (!keyRecord.isActive) {
      return null;
    }

    // Check 3: Is it Expired?
    if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
      return null;
    }

    // Check 4: Does the password match?
    if (await bcrypt.compare(rawKey, keyRecord.hash)) {
      return keyRecord;
    }
    
    return null;
  }
}
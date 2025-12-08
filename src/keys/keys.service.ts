import { Injectable, NotFoundException } from '@nestjs/common';
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

  // --- Create Key ---
  async createKey(user: User, serviceName: string) {
    const rawKey = 'sk_live_' + crypto.randomBytes(20).toString('hex');
    const hash = await bcrypt.hash(rawKey, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 Day Expiry

    const apiKey = this.repo.create({
      prefix: rawKey.substring(0, 10),
      hash: hash,
      user: user,
      isActive: true,
      expiresAt: expiresAt,
      serviceName: serviceName, // <--- Saving the name
    });

    await this.repo.save(apiKey);

    return {
      apiKey: rawKey,
      serviceName: serviceName,
      expiresAt: expiresAt,
      message: 'Save this key now. It will not be shown again.',
    };
  }

  // --- Validate Key (Used by Guard) ---
  async validateApiKey(rawKey: string) {
    const prefix = rawKey.substring(0, 10);
    
    const keyRecord = await this.repo.findOne({
      where: { prefix },
      relations: ['user'],
    });

    if (!keyRecord) return null;

    // Check Revocation
    if (!keyRecord.isActive) return null;

    // Check Expiration
    if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
      return null;
    }

    // Check Hash
    if (await bcrypt.compare(rawKey, keyRecord.hash)) {
      return keyRecord;
    }
    
    return null;
  }

  // --- Revoke Key ---
  async revokeKey(id: string, userId: string) {
    const key = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!key) {
      throw new NotFoundException('Key not found or does not belong to you');
    }

    key.isActive = false;
    await this.repo.save(key);

    return { message: `API Key for ${key.serviceName || 'service'} revoked successfully` };
  }
}
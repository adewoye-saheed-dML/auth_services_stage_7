import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { ApiKey } from './entities/api-key.entity';
import { JwtService } from '@nestjs/jwt'; 
// Note: We might need JwtService if KeysController uses the Guard. 
// However, the Guard is usually provided by AuthModule. 
// To avoid circular dependency, we will rely on AuthModule importing KeysModule.

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  controllers: [KeysController],
  providers: [KeysService],
  exports: [KeysService], // Export so AuthGuard can use it
})
export class KeysModule {}
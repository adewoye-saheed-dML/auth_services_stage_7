import { 
  Controller, 
  Post, 
  Delete, 
  Param, 
  UseGuards, 
  Req, 
  UnauthorizedException 
} from '@nestjs/common';
import { KeysService } from './keys.service';
import { ApiOrJwtAuthGuard } from '../auth/guards/api-or-jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('API Keys') 
@Controller('keys')
export class KeysController {
  constructor(private keysService: KeysService) {}

  // --- 1. Create API Key ---
  @ApiBearerAuth() 
  @UseGuards(ApiOrJwtAuthGuard)
  @Post('create')
  createKey(@Req() req, @CurrentUser() user) {
    // Security: Only allow real users (JWT) to create keys, not other API keys
    if (req.authType !== 'jwt') {
      throw new UnauthorizedException('Only users logged in via JWT can create API keys');
    }
    return this.keysService.createKey(user);
  }

  // --- 2. Revoke API Key ---
  @ApiBearerAuth()
  @UseGuards(ApiOrJwtAuthGuard)
  @Delete(':id') // URL: /keys/uuid-goes-here
  revokeKey(@Param('id') id: string, @Req() req, @CurrentUser() user) {
    // Security: Only allow real users to revoke keys
    if (req.authType !== 'jwt') {
      throw new UnauthorizedException('Only users logged in via JWT can revoke API keys');
    }
    return this.keysService.revokeKey(id, user.id);
  }
}
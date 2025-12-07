import { Controller, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { KeysService } from './keys.service';
import { ApiOrJwtAuthGuard } from '../auth/guards/api-or-jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // <--- IMPORT THIS

@ApiTags('API Keys') 
@Controller('keys')
export class KeysController {
  constructor(private keysService: KeysService) {}

  @ApiBearerAuth() 
  @UseGuards(ApiOrJwtAuthGuard)
  @Post('create')
  createKey(@Req() req, @CurrentUser() user) {
    if (req.authType !== 'jwt') {
      throw new UnauthorizedException('Only users logged in via JWT can create API keys');
    }
    return this.keysService.createKey(user);
  }
}
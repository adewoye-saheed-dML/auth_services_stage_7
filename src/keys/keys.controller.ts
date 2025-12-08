import { 
  Controller, 
  Post, 
  Body, 
  Delete, 
  Param, 
  UseGuards, 
  Req, 
  UnauthorizedException 
} from '@nestjs/common';
import { KeysService } from './keys.service';
import { ApiOrJwtAuthGuard } from '../auth/guards/api-or-jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateKeyDto } from './dto/create-key.dto';

@ApiTags('API Keys')
@Controller('keys')
export class KeysController {
  constructor(private keysService: KeysService) {}

  // --- 1. Create API Key ---
  @ApiBearerAuth()
  @UseGuards(ApiOrJwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Generate a new API Key for a service' })
  createKey(
    @Req() req, 
    @CurrentUser() user, 
    @Body() dto: CreateKeyDto // <--- Accepts serviceName
  ) {
    if (req.authType !== 'jwt') {
      throw new UnauthorizedException('Only users logged in via JWT can create API keys');
    }
    return this.keysService.createKey(user, dto.serviceName);
  }

  // --- 2. Revoke API Key ---
  @ApiBearerAuth()
  @UseGuards(ApiOrJwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Revoke (disable) an API Key immediately' })
  revokeKey(@Param('id') id: string, @Req() req, @CurrentUser() user) {
    if (req.authType !== 'jwt') {
      throw new UnauthorizedException('Only users logged in via JWT can revoke API keys');
    }
    return this.keysService.revokeKey(id, user.id);
  }
}
import { 
  Controller, 
  Post, 
  Delete, 
  UseGuards, 
  Param, 
  Body // <--- Essential import
} from '@nestjs/common';
import { KeysService } from './keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateKeyDto } from './dto/create-key.dto'; // <--- Import DTO

@ApiTags('API Keys')
@Controller('keys')
export class KeysController {
  constructor(private keysService: KeysService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // Strict Guard (Humans Only)
  @ApiOperation({ summary: 'Generate a new API Key' })
  @ApiBody({ type: CreateKeyDto }) // Shows the JSON box in Swagger
  createKey(
    @CurrentUser() user, 
    @Body() dto: CreateKeyDto // <--- Captures the JSON body
  ) {
    return this.keysService.createKey(user, dto.serviceName);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // Strict Guard (Humans Only)
  @ApiOperation({ summary: 'Revoke an API Key' })
  revokeKey(@Param('id') id: string, @CurrentUser() user) {
    return this.keysService.revokeKey(id, user.id);
  }
}
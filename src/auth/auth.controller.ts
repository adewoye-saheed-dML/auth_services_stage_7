import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOrJwtAuthGuard } from './guards/api-or-jwt.guard'; // Keep this one for "OR" logic
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  // ... login/signup ...

  // Scenario 1: Strict User Route (e.g. Change Password)
  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  getMyDetails(@CurrentUser() user) {
    return user;
  }

  // Scenario 2: Hybrid Route (Users OR Bots can view profile)
  @Get('profile')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @UseGuards(ApiOrJwtAuthGuard) // Stays Hybrid
  getProfile(@CurrentUser() user) {
    return user;
  }
}
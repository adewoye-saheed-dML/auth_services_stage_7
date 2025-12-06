import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOrJwtAuthGuard } from './guards/api-or-jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger'; // Import these
import { AuthDto } from './dto/auth.dto'; // Import the DTO

@ApiTags('Authentication') // Groups endpoints in Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) { // Change 'any' to 'AuthDto'
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) { // Change 'any' to 'AuthDto'
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(ApiOrJwtAuthGuard)
  @ApiBearerAuth() // Shows the Lock icon for JWT
  @ApiSecurity('x-api-key') // Shows the Lock icon for API Key
  getProfile(@CurrentUser() user: any) {
    return {
      message: 'Secure data accessed',
      user: user,
    };
  }
}
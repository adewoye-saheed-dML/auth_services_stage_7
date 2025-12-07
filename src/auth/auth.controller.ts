import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOrJwtAuthGuard } from './guards/api-or-jwt.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiSecurity, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // --- 1. Public Routes (No Auth) ---
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to get a JWT token' })
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  // --- 2. JWT Only Route (Strict) ---
  // Only humans with a token can access this
  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Get my details (Strict: JWT Only)' })
  getMyDetails(@CurrentUser() user) {
    return {
      message: 'You are seeing this because you have a valid JWT.',
      user,
    };
  }

  // --- 3. Hybrid Route (Both) ---
  // Humans (JWT) OR Bots (API Key) can access this
  @Get('profile')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @UseGuards(ApiOrJwtAuthGuard)
  @ApiOperation({ summary: 'Get profile (Hybrid: JWT or API Key)' })
  getProfile(@CurrentUser() user) {
    return {
      message: 'You are authenticated (User or Bot)',
      user,
    };
  }
}
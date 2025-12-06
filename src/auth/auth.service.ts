import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: any) {
    const { email, password } = dto;
    const existing = await this.usersService.findOneByEmail(email);
    if (existing) throw new BadRequestException('Email exists');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.usersService.create({ email, password: hashedPassword });
    return this.login(user);
  }

  async login(user: any) {
    // Basic validation if user object doesn't come from signup
    if (!user.id && user.email) {
       const dbUser = await this.usersService.findOneByEmail(user.email);
       if (!dbUser || !(await bcrypt.compare(user.password, dbUser.password))) {
         throw new UnauthorizedException('Invalid credentials');
       }
       user = dbUser;
    }
    
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email },
    };
  }
}
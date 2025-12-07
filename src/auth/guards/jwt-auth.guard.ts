import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers['authorization'];
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid Bearer token');
      }
  
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token);
        // Map 'sub' to 'id' for TypeORM compatibility
        request['user'] = { ...decoded, id: decoded.sub }; 
        request['authType'] = 'jwt';
        return true;
      } catch (e) {
        throw new UnauthorizedException('Invalid or expired User Token');
      }
    }
  }
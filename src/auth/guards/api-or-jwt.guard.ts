import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { KeysService } from '../../keys/keys.service';
  import { Request } from 'express';
  
  @Injectable()
  export class ApiOrJwtAuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private keysService: KeysService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers['authorization'];
      const apiKeyHeader = request.headers['x-api-key'];
  
      // 1. Try JWT
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = this.jwtService.verify(token);
          
          request['user'] = { ...decoded, id: decoded.sub };
          
          request['authType'] = 'jwt';
          return true;
        } catch (e) {
          console.log('🔴 JWT Verification Failed:', e.message);
        }
      }
  
      // 2. Try API Key
      if (apiKeyHeader && typeof apiKeyHeader === 'string') {
        const validKey = await this.keysService.validateApiKey(apiKeyHeader);
        if (validKey) {
          request['user'] = validKey.user;
          request['authType'] = 'api-key';
          return true;
        }
      }
  
      throw new UnauthorizedException(
        'Please provide a valid Bearer Token or API Key',
      );
    }
  }
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { KeysService } from '../../keys/keys.service';
  import { Request } from 'express';
  
  @Injectable()
  export class ApiKeyAuthGuard implements CanActivate {
    constructor(private keysService: KeysService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const apiKey = request.headers['x-api-key'];
  
      if (!apiKey || typeof apiKey !== 'string') {
        throw new UnauthorizedException('Missing x-api-key header');
      }
  
      const validKey = await this.keysService.validateApiKey(apiKey);
      
      if (!validKey) {
        throw new UnauthorizedException('Invalid API Key');
      }
  
      request['user'] = validKey.user; // Attach the owner of the key
      request['authType'] = 'api-key';
      return true;
    }
  }
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKeyDto {
  @ApiProperty({ 
    example: 'Inventory Microservice', 
    description: 'A name to identify who is using this key (e.g., Billing App, IOS App)' 
  })
  @IsString()
  @IsNotEmpty()
  serviceName: string;
}
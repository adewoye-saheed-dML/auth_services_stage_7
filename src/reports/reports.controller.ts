import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from '../auth/guards/api-key.guard';
import { ApiSecurity, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reports (Bots Only)')
@Controller('reports')
export class ReportsController {

  @Get('daily-summary')
  @ApiSecurity('x-api-key') // Tells Swagger this needs an API Key
  @UseGuards(ApiKeyAuthGuard) // <--- STRICT: Only API Keys allowed
  @ApiOperation({ summary: 'Download report (Strict: API Key Only)' })
  getReport() {
    return {
      report: 'Daily Summary',
      status: 'Generated',
      timestamp: new Date(),
    };
  }
}
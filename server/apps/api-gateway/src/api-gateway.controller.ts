import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { Public } from './auth/decorator/public.decorator';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Public()
  @Get('status')
  checkStatus(): object {
    return this.apiGatewayService.checkStatus();
  }
}

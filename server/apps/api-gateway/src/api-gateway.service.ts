import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  checkStatus(): {
    status: string;
    message: string;
    timestamp: string;
    uptime: number;
  } {
    return {
      status: 'ok',
      message: 'API Gateway is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  checkHealth(): string {
    return 'I am alive!';
  }
}

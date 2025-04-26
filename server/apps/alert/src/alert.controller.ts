import { Controller } from '@nestjs/common';
import { AlertService } from './alert.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @MessagePattern({ cmd: 'get.status' })
  getHello(): string {
    return this.alertService.getStatus();
  }
}

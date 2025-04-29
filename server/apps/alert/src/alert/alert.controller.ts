import { Controller } from '@nestjs/common';
import { AlertService } from './alert.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAlertDto } from './dto/alert.dto';

@Controller()
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @MessagePattern({ cmd: 'get.status' })
  getHello(): string {
    return this.alertService.getStatus();
  }

  @MessagePattern({ cmd: 'create.alert' })
  createAlert(@Payload() data: CreateAlertDto) {
    return this.alertService.createAlert(data);
  }

  @MessagePattern({ cmd: 'get.user.alerts' })
  getUserAlerts(@Payload() userId: string) {
    return this.alertService.getUserAlerts(userId);
  }

  @MessagePattern({ cmd: 'get.all.alerts' })
  getAllAlerts() {
    return this.alertService.getAllAlerts();
  }

  @MessagePattern({ cmd: 'mark.alert.read' })
  markAlertAsRead(@Payload() data: { userId: string; alertId: string }) {
    return this.alertService.markAlertAsRead(data.userId, data.alertId);
  }
}

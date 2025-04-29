import { Controller, Get, Post, Body, Req, Patch, Param } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/alert.dto';
import { UserRequest } from '../../types/auth';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserRole } from '@app/common/types/user';
import { Public } from '../../auth/decorator/public.decorator';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  // Get the status of the alert service
  @Public()
  @Get('status')
  getStatus() {
    return this.alertService.getStatus();
  }

  // Create a new alert
  @Post()
  createHTTPAlert(@Req() req: UserRequest, @Body() createAlertDto: CreateAlertDto) {
    const { sub: userId, email } = req.user;
    const mobile = '0771234567';
    return this.alertService.createHTTPAlert(userId, email, mobile, createAlertDto);
  }

  // Get all alerts for admin
  @Get('admin')
  @Roles(UserRole.ADMIN)
  getAdminAlerts(@Req() req: UserRequest) {
    return this.alertService.getAllAlerts();
  }

  // Get alerts for the current user
  @Get()
  getCustomerAlerts(@Req() req: UserRequest) {
    const userId = req.user.sub;
    return this.alertService.getUserAlerts(userId);
  }

  // Mark an alert as read
  @Patch(':id/read')
  markAlertAsRead(@Req() req: UserRequest, @Param('id') alertId: string) {
    const userId = req.user.sub;
    return this.alertService.markAlertAsRead(userId, alertId);
  }
}

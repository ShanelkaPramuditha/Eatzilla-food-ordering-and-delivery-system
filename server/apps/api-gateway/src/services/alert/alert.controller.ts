import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/alert.dto';
import { UserRequest } from '../../types/auth';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserRole } from '@app/common/types/user';
import { Public } from '../../auth/decorator/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Alerts')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  // Get the status of the alert service
  @Public()
  @Get('status')
  @ApiOperation({ summary: 'Get alert service status' })
  @ApiResponse({ status: 200, description: 'Return the alert service status' })
  getStatus() {
    return this.alertService.getStatus();
  }

  // Create a new alert
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiResponse({ status: 201, description: 'The alert has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  createAlert(@Req() req: UserRequest, @Body() createAlertDto: CreateAlertDto) {
    const { sub: userId } = req.user;

    return this.alertService.createAlert(userId, createAlertDto);
  }

  // Get all alerts for admin
  @Get('admin')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all alerts (admin only)' })
  @ApiResponse({ status: 200, description: 'Return all alerts' })
  getAdminAlerts(@Req() req: UserRequest) {
    console.log(`Admin alerts accessed by: ${req.user.name} (${req.user.sub})`);
    return this.alertService.getAllAlerts();
  }

  // Get alerts for the current user
  @Get()
  @ApiBearerAuth()
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get alerts for the current user' })
  @ApiResponse({ status: 200, description: 'Return user alerts' })
  getCustomerAlerts(@Req() req: UserRequest) {
    const userId = req.user.sub;
    console.log(`Customer alerts accessed by: ${req.user.name} (${userId})`);
    return this.alertService.getUserAlerts(userId);
  }
}

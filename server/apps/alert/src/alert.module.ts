import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AlertConfigModule } from './config/alert-config.module';

@Module({
  imports: [AlertConfigModule],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}

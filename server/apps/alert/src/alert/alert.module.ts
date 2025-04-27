import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AlertConfigModule } from '../config/alert-config.module';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [
    AlertConfigModule,
    DatabaseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
  ],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}

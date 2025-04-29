import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import {
  MicroserviceConfigModule,
  MicroserviceConfigService,
} from '../../config/microservice.config';
import { Microservice } from '../../constants/microservice';
import { NotificationModule } from '../../websocket/websocket.module';

@Module({
  imports: [
    MicroserviceConfigModule,
    NotificationModule,
    ClientsModule.registerAsync([
      {
        name: Microservice.ALERT_SERVICE,
        imports: [MicroserviceConfigModule],
        inject: [MicroserviceConfigService],
        useFactory: (microserviceConfigService: MicroserviceConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [microserviceConfigService.alertService.url],
            queue: 'alert_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [AlertService],
  controllers: [AlertController],
  exports: [AlertService],
})
export class AlertModule {}

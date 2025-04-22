import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ALERT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ALERT_SERVICE_HOST,
          port: Number(process.env.ALERT_SERVICE_PORT),
        },
      },
    ]),
  ],
  providers: [AlertService],
  controllers: [AlertController],
})
export class AlertModule {}

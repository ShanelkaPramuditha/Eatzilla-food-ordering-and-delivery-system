import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  MicroserviceConfigModule,
  MicroserviceConfigService,
} from '../../config/microservice.config';
import { Microservice } from '../../constants/microservice';

@Module({
  imports: [
    MicroserviceConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [MicroserviceConfigModule],
        inject: [MicroserviceConfigService],
        name: Microservice.PAYMENT_SERVICE,
        useFactory: (microserviceConfigService: MicroserviceConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: microserviceConfigService.paymentService.host,
            port: microserviceConfigService.paymentService.port,
          },
        }),
      },
    ]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}

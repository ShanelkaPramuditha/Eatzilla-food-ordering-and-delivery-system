import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  MicroserviceConfigModule,
  MicroserviceConfigService,
} from '../../config/microservice.config';
import { Microservice } from '../../constants/microservice';
import { OrderModule } from '../order/order.module';
import { AlertModule } from '../alert/alert.module';

@Module({
  imports: [
    AlertModule,
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
    OrderModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}

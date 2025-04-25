import { Module } from '@nestjs/common';
import { DeliveryController } from './controllers/delivery.controller';
import { DeliveryService } from './services/delivery.service';

@Module({
  imports: [],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}

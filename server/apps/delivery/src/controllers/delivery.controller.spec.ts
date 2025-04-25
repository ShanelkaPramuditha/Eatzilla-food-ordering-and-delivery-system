import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from '../services/delivery.service';

describe('DeliveryController', () => {
  let deliveryController: DeliveryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [DeliveryService],
    }).compile();

    deliveryController = app.get<DeliveryController>(DeliveryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(deliveryController.getHello()).toBe('Hello World!');
    });
  });
});

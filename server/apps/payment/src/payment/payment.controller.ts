import { Controller, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { PaymentSessionDto } from '@app/common/dtos/transaction.dto';
import { Transaction } from './schemas/transaction.schema';

@Controller()
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'get.status' })
  getStatus(): string {
    return this.paymentService.getStatus();
  }

  @MessagePattern({ cmd: 'payment.createTransaction' })
  async createTransaction(payload: PaymentSessionDto) {
    try {
      const transaction = (await this.paymentService.createTransaction(payload)) as Transaction;
      return { success: true, transaction };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new RpcException(`Error creating transaction: ${errorMessage}`);
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { PaymentSessionDto } from '@app/common/dtos/transaction.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  getStatus(): string {
    return 'Payment service is running';
  }

  async createTransaction(payload: PaymentSessionDto): Promise<any> {
    // Check sessionId already exists
    const existingTransaction = await this.transactionModel.findOne({
      sessionId: payload.sessionId,
    });
    if (existingTransaction) {
      this.logger.warn(`Transaction with sessionId ${payload.sessionId} already exists`);
      return existingTransaction;
    }

    const transaction = new this.transactionModel(payload);
    await transaction.save();
    return transaction;
  }
}

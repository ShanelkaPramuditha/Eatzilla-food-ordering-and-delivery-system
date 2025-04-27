import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { MessagePattern } from '@nestjs/microservices';
import { CheckoutPayload } from '@app/common/types/payment';

@Controller()
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) {}

  @MessagePattern({ cmd: 'post.checkout' })
  async createCheckoutSession(data: CheckoutPayload) {
    try {
      const session = await this.stripeService.createCheckoutSessionWithPrice(data);

      return session;
    } catch (error) {
      this.logger.error(`Error creating checkout session: ${error}`);
      throw new HttpException(
        'Failed to create checkout session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern({ cmd: 'get.sessionStatus' })
  async getSessionStatus(sessionId: string) {
    try {
      const session = await this.stripeService.getSessionStatus(sessionId);
      return session;
    } catch (error) {
      this.logger.error(`Error retrieving session status: ${error}`);
      throw new HttpException(
        'Failed to retrieve session status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern({ cmd: 'get.receipt' })
  async getReceiptUrl(sessionId: string) {
    try {
      const receiptData = await this.stripeService.getReceiptUrl(sessionId);
      return receiptData;
    } catch (error) {
      this.logger.error(`Error retrieving receipt: ${error}`);
      throw new HttpException('Failed to retrieve receipt', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

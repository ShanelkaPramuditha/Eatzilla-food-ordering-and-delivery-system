import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CheckoutPayload, StripeService } from './stripe.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) {}

  @MessagePattern({ cmd: 'post.checkout' })
  async createCheckoutSession(data: CheckoutPayload[]) {
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
}

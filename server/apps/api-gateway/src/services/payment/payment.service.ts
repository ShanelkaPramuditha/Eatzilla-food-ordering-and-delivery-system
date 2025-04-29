import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Microservice } from '../../constants/microservice';
import { CheckoutPayload, TransactionResponse } from '@app/common/types/payment';
import { PaymentSessionDto } from '@app/common/dtos/transaction.dto';
import { catchRpcError } from '../../filters/rpc-exception.filter';
import { OrderService } from '../order/order.service';
import { AlertService } from '../alert/alert.service';
import { AlertCategory, AlertLevel, AlertType } from '@app/common/types/alert';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(Microservice.PAYMENT_SERVICE)
    private readonly paymentClient: ClientProxy,
    private readonly orderService: OrderService,
    private readonly alertService: AlertService,
    private readonly userService: UsersService,
  ) {}

  getStatus() {
    return this.paymentClient
      .send({ cmd: 'get.status' }, {})
      .pipe(catchRpcError('Failed to get payment service status'));
  }

  createTransaction(payload: PaymentSessionDto) {
    // Create a transaction using the payment client
    const transaction = this.paymentClient
      .send<TransactionResponse>({ cmd: 'payment.createTransaction' }, payload)
      .pipe(catchRpcError('Failed to create transaction'));

    // Update order isPaid status
    transaction.subscribe({
      next: (response: TransactionResponse) => {
        if (response && response.transaction?.paymentStatus === 'paid') {
          if (payload.orderId) {
            this.orderService.updatePaidStatus(payload.orderId, true).subscribe({
              next: (orderResponse) => {
                if (orderResponse) {
                  this.userService
                    .findById(payload.customerId!)
                    .then((user) => {
                      if (user) {
                        this.alertService
                          .createNotificationAlert(payload.customerId!, {
                            types: [AlertType.NOTIFICATION],
                            mobile: user.mobile,
                            email: user.email,
                            level: AlertLevel.INFO,
                            category: AlertCategory.ORDER,
                            data: {
                              orderId: payload.orderId,
                              status: 'paid',
                              amount: payload.amount,
                            },
                            subject: 'Order Payment Successful',
                            message: `Order ${payload.orderId} has been paid successfully.`,
                          })
                          .subscribe();
                      }
                    })
                    .catch((error) => {
                      console.error('Error finding user:', error);
                    });
                } else {
                  console.error('Failed to update order payment status:', orderResponse);
                }
              },
              error: (error) => {
                console.error('Error updating order payment status:', error);
              },
            });
          } else {
            console.error('Cannot update order payment status: orderId is undefined');
          }
        } else {
          console.error('Failed to create transaction:', response);
        }
      },
      error: (error) => {
        console.error('Error creating transaction:', error);
      },
    });

    return transaction;
  }

  checkout(payload: CheckoutPayload) {
    return this.paymentClient
      .send({ cmd: 'post.checkout' }, payload)
      .pipe(catchRpcError('Failed to process checkout'));
  }

  getSessionStatus(sessionId: string) {
    return this.paymentClient
      .send({ cmd: 'get.sessionStatus' }, sessionId)
      .pipe(catchRpcError('Failed to get session status'));
  }

  getReceiptUrl(sessionId: string) {
    return this.paymentClient
      .send({ cmd: 'get.receipt' }, sessionId)
      .pipe(catchRpcError('Failed to get receipt URL'));
  }

  getTransactionByOrderId(orderId: string) {
    return this.paymentClient
      .send({ cmd: 'payment.getTransactionByOrderId' }, orderId)
      .pipe(catchRpcError('Failed to get transaction by order ID'));
  }

  getTransactionBySessionId(sessionId: string) {
    return this.paymentClient
      .send({ cmd: 'payment.getTransactionBySessionId' }, sessionId)
      .pipe(catchRpcError('Failed to get transaction by session ID'));
  }
}

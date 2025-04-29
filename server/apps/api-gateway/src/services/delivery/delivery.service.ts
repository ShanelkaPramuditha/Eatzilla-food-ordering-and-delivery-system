import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout, catchError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);
  private readonly requestTimeout = 10000; // 10 seconds timeout

  constructor(
    @Inject('DELIVERY_SERVICE')
    private readonly deliveryClient: ClientProxy,
  ) {}

  getStatus() {
    return this.deliveryClient.send({ cmd: 'get.status' }, {});
  }

  async updateDriverAvailability(updateDto: any) {
    this.logger.log(`Forwarding driver availability update: ${JSON.stringify(updateDto)}`);
    try {
      // We use lastValueFrom to convert Observable to Promise
      return await lastValueFrom(
        this.deliveryClient.send('driver.update.availability', updateDto).pipe(
          timeout(this.requestTimeout),
          catchError((err) => {
            this.logger.error(
              `Error updating driver availability in delivery service: ${err.message}`,
            );
            throw new HttpException(
              'Failed to update driver availability. Please try again later.',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }),
        ),
      );
    } catch (error) {
      this.logger.error(`Error updating driver availability: ${error.message}`);
      throw error;
    }
  }

  async getDriverStatus(driverId: string) {
    try {
      this.logger.log(`Getting status for driver: ${driverId}`);
      return await lastValueFrom(
        this.deliveryClient.send('driver.get.status', { driverId }).pipe(
          timeout(this.requestTimeout),
          catchError((err) => {
            this.logger.error(`Error getting driver status: ${err.message}`);
            throw new HttpException(
              'Failed to get driver status. Please try again later.',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }),
        ),
      );
    } catch (error) {
      this.logger.error(`Error getting driver status: ${error.message}`);
      throw error;
    }
  }

  async findAvailableDrivers(lat: number, lng: number, distance?: number) {
    try {
      this.logger.log(
        `Finding available drivers near: ${lat}, ${lng}, distance: ${distance || 'default'}km`,
      );
      return await lastValueFrom(
        this.deliveryClient.send('drivers.find.available', { lat, lng, distance }).pipe(
          timeout(this.requestTimeout),
          catchError((err) => {
            this.logger.error(`Error finding available drivers: ${err.message}`);
            throw new HttpException(
              'Failed to find available drivers. Please try again later.',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }),
        ),
      );
    } catch (error) {
      this.logger.error(`Error finding available drivers: ${error.message}`);
      throw error;
    }
  }

  async assignDriverToOrder(driverId: string, orderId: string) {
    try {
      this.logger.log(`Assigning driver ${driverId} to order ${orderId}`);
      return await lastValueFrom(
        this.deliveryClient
          .send(
            { cmd: 'assign.driver' },
            {
              deliveryPersonId: driverId,
              orderId,
            },
          )
          .pipe(
            timeout(this.requestTimeout),
            catchError((err) => {
              this.logger.error(`Error assigning driver to order: ${err.message}`);
              throw new HttpException(
                'Failed to assign driver to order. Please try again later.',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
    } catch (error) {
      this.logger.error(`Error assigning driver to order: ${error.message}`);
      throw error;
    }
  }

  async completeDelivery(driverId: string) {
    try {
      this.logger.log(`Completing delivery for driver ${driverId}`);
      return await lastValueFrom(
        this.deliveryClient.send({ cmd: 'complete.delivery' }, { deliveryPersonId: driverId }).pipe(
          timeout(this.requestTimeout),
          catchError((err) => {
            this.logger.error(`Error completing delivery: ${err.message}`);
            throw new HttpException(
              'Failed to complete delivery. Please try again later.',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }),
        ),
      );
    } catch (error) {
      this.logger.error(`Error completing delivery: ${error.message}`);
      throw error;
    }
  }
}

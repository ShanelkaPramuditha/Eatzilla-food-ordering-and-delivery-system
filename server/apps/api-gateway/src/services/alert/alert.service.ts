import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AlertService {
  constructor(
    @Inject('ALERT_SERVICE')
    private readonly alertClient: ClientProxy,
  ) {}

  getStatus() {
    return this.alertClient.send({ cmd: 'get.status' }, {});
  }
}

import { Module } from '@nestjs/common';
import { NotificationGateway } from './websocket.gateway';
import { Logger } from '@nestjs/common';

@Module({
  providers: [Logger, NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}

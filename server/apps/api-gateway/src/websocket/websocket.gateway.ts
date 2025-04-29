import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
    this.server = server;
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, payload: { userId: string }) {
    this.logger.log(`Client ${client.id} joining room for user: ${payload.userId}`);
    await client.join(payload.userId);
    return { success: true };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, payload: { userId: string }) {
    this.logger.log(`Client ${client.id} leaving room for user: ${payload.userId}`);
    await client.leave(payload.userId);
    return { success: true };
  }

  sendAlertToAll(data: object) {
    this.server.emit('alert', data);
  }

  sendAlertToRoom(room: string, message: string) {
    this.server.to(room).emit('alert', message);
  }

  sendAlertToUser(userId: string, data: object) {
    this.server.to(userId).emit('alert', data);
  }
}

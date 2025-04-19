import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private static connections: Map<string, Connection> = new Map();

  constructor(private configService: ConfigService) {}

  /**
   * Retrieves a tenant-specific database connection or creates one if it doesn't exist
   */
  getDatabaseConnection(tenantId: string = 'eatzilla'): Connection {
    if (DatabaseService.connections.has(tenantId)) {
      const connection = DatabaseService.connections.get(tenantId);
      if (connection) {
        return connection;
      }
    }

    const dbUri = `${this.configService.get('MONGO_URI')}/${tenantId}`;
    const connection = createConnection(dbUri, {
      maxPoolSize: 10, // maximum number of connections in the pool
      timeoutMS: 30000, // close inactive sockets after 30 seconds
    });

    DatabaseService.connections.set(tenantId, connection);
    return connection;
  }

  /**
   * Closes all connections (useful for cleanup on shutdown)
   */
  async closeAllConnections() {
    for (const connection of DatabaseService.connections.values()) {
      await connection.close();
    }
    DatabaseService.connections.clear();
  }

  async onModuleDestroy() {
    await this.closeAllConnections();
  }

  onModuleInit() {
    Logger.log('DatabaseService initialized', 'DatabaseConnection');
  }
}

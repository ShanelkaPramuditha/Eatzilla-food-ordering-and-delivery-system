import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    RestaurantModule,
  ],
})
export class AppModule {}

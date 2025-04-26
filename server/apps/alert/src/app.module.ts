import { Module } from '@nestjs/common';
import { AlertConfigModule } from './config/alert-config.module';
import { DatabaseModule } from '@app/common';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [DatabaseModule, AlertConfigModule, AlertModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

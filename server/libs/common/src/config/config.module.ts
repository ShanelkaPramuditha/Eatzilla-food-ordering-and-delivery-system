import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ZodType } from 'zod';
import { validateEnv } from './env.validation';

@Module({})
export class ConfigModule {
  static forRoot<T extends Record<string, any>>(options: {
    schema: ZodType<T>;
    isGlobal?: boolean;
    envFilePath?: string | string[];
    expandVariables?: boolean;
  }): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: options.isGlobal ?? true,
          envFilePath: options.envFilePath ?? ['.env'],
          expandVariables: options.expandVariables ?? true,
          validate: (config): T => validateEnv(config, options.schema),
        }),
      ],
      exports: [NestConfigModule],
    };
  }
}

import { Logger } from '@nestjs/common';
import { z } from 'zod';

// Common environment schema that's shared between all services
const commonEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_GATEWAY_PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('*'),
  API_PREFIX: z.string().default('api'),
  MONGO_URI: z.string().url(),
  MONGO_DB_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  JWT_ISSUER: z.string().default('myapp.com'),
  COOKIE_ACCESS_EXPIRATION: z.string().default('15m'),
  COOKIE_REFRESH_EXPIRATION: z.string().default('7d'),
  FRONTEND_URL: z.string().url(),
});

// API Gateway specific schema
export const apiGatewayEnvSchema = commonEnvSchema.extend({
  API_GATEWAY_HOST: z.string().min(1),
  API_GATEWAY_PORT: z.coerce.number().default(3000),
});

// Alert service specific schema
export const alertServiceEnvSchema = commonEnvSchema.extend({
  ALERT_SERVICE_RABBITMQ_URL: z.string().min(1),
});

// Payment service specific schema
export const paymentServiceEnvSchema = commonEnvSchema.extend({
  PAYMENT_SERVICE_ALLOWED_HOST: z.string().default('0.0.0.0'),
  PAYMENT_SERVICE_HOST: z.string().min(1),
  PAYMENT_SERVICE_PORT: z.coerce.number().default(3002),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_API_VERSION: z.string().default('2025-03-31.basil'),
});

// Order service specific schema
export const orderServiceEnvSchema = commonEnvSchema.extend({
  ORDER_SERVICE_HOST: z.string().min(1),
  ORDER_SERVICE_PORT: z.coerce.number().default(3003),
});

// Restaurant service specific schema
export const restaurantServiceEnvSchema = commonEnvSchema.extend({
  RESTAURANT_SERVICE_HOST: z.string().min(1),
  RESTAURANT_SERVICE_PORT: z.coerce.number().default(3004),
});

// Delivery service specific schema
export const deliveryServiceEnvSchema = commonEnvSchema.extend({
  DELIVERY_SERVICE_HOST: z.string().min(1),
  DELIVERY_SERVICE_PORT: z.coerce.number().default(3005),
});

// Function to validate environment variables
export function validateEnv<T>(config: Record<string, unknown>, schema: z.ZodType<T>): T {
  const result = schema.safeParse(config);

  const logger = new Logger('ConfigValidation');

  if (!result.success) {
    logger.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

import { z } from 'zod';

// Common environment schema that's shared between all services
const commonEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('*'),
  API_PREFIX: z.string().default('api'),
  MONGO_URI: z.string().url(),
  MONGO_DB_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  JWT_ISSUER: z.string().default('myapp.com'),
});

// API Gateway specific schema
export const apiGatewayEnvSchema = commonEnvSchema.extend({
  PAYMENT_SERVICE_HOST: z.string().min(1),
  PAYMENT_SERVICE_PORT: z.coerce.number().default(3001),
});

// Payment service specific schema
export const paymentServiceEnvSchema = commonEnvSchema.extend({});

// Function to validate environment variables
export function validateEnv<T>(config: Record<string, unknown>, schema: z.ZodType<T>): T {
  const result = schema.safeParse(config);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

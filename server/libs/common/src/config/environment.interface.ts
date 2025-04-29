import Stripe from 'stripe';

// Environment interface types that match the Zod schemas
export interface CommonEnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  CORS_ORIGIN: string;
  API_PREFIX: string;
  MONGO_URI: string;
  MONGO_DB_NAME: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  JWT_ISSUER: string;
  COOKIE_ACCESS_EXPIRATION: string;
  COOKIE_REFRESH_EXPIRATION: string;
  FRONTEND_URL: string;
}

export interface ApiGatewayEnvironmentVariables extends CommonEnvironmentVariables {
  API_GATEWAY_HOST: string;
  API_GATEWAY_PORT: number;
}

export interface AlertEnvironmentVariables extends CommonEnvironmentVariables {
  ALERT_SERVICE_RABBITMQ_URL: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
}

export interface PaymentEnvironmentVariables extends CommonEnvironmentVariables {
  PAYMENT_SERVICE_ALLOWED_HOST: string;
  PAYMENT_SERVICE_HOST: string;
  PAYMENT_SERVICE_PORT: number;
  STRIPE_SECRET_KEY: string;
  STRIPE_API_VERSION: Stripe.StripeConfig['apiVersion'];
}

export interface OrderEnvironmentVariables extends CommonEnvironmentVariables {
  ORDER_SERVICE_HOST: string;
  ORDER_SERVICE_PORT: number;
}

export interface DeliveryEnvironmentVariables extends CommonEnvironmentVariables {
  DELIVERY_SERVICE_HOST: string;
  DELIVERY_SERVICE_PORT: number;
}

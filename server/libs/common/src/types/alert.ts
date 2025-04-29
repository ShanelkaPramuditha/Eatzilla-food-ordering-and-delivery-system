export enum AlertType {
  NOTIFICATION = 'notification',
  EMAIL = 'email',
  SMS = 'sms',
}

export enum AlertLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

export enum AlertCategory {
  PAYMENT = 'payment',
  ORDER = 'order',
  DEFAULT = 'default',
}

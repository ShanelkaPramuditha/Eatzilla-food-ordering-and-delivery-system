export interface AlertObject {
  response: {
    createdAt: string;
    email: string;
    id: string;
    category: 'payment' | 'order' | 'default';
    data: object;
    isRead: false;
    level: 'info' | 'error' | 'warning';
    message: string;
    mobile: string;
    status: 'pending' | 'sent' | 'failed';
    subject: string;
    updatedAt: string;
    userId: string;
  };
}

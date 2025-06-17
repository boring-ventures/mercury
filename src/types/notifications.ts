export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  metadata?: any;
  createdAt: Date;
  readAt?: Date;
  profileId: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: NotificationType;
  metadata?: any;
  profileId?: string; // Optional for admin notifications
  profileIds?: string[]; // For bulk notifications
}

export interface UpdateNotificationData {
  read?: boolean;
  readAt?: Date;
}

export interface NotificationFilters {
  read?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}

export enum NotificationType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface NotificationTemplate {
  title: string;
  message: string;
  type: NotificationType;
  metadata?: any;
}

export interface SystemNotificationTemplates {
  REQUEST_CREATED: NotificationTemplate;
  REQUEST_APPROVED: NotificationTemplate;
  REQUEST_REJECTED: NotificationTemplate;
  QUOTATION_RECEIVED: NotificationTemplate;
  CONTRACT_SIGNED: NotificationTemplate;
  PAYMENT_RECEIVED: NotificationTemplate;
  DOCUMENT_APPROVED: NotificationTemplate;
  DOCUMENT_REJECTED: NotificationTemplate;
  REGISTRATION_APPROVED: NotificationTemplate;
  REGISTRATION_REJECTED: NotificationTemplate;
}

export type NotificationType = "service" | "update";

export type NotificationStatus = "unread" | "read";

export interface Notification {
  id: string;
  title: string;
  description: string;
  content: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: Date;
  priority?: "low" | "medium" | "high";
}

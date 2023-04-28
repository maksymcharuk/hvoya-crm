import { NotificationType } from "@enums/notification-type.enum";
import { NotificationData } from "./notification-data.interface";

export interface NotificationCreatedEvent {
  message: string;
  data: NotificationData;
  userId: number;
  type: NotificationType;
}

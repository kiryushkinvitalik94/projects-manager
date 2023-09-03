export enum NotificationTypes {
  info = "info",
  error = "error",
  success = "success",
}

export type NotificationTypesKeys = keyof typeof NotificationTypes;

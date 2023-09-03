import React, { useState, useEffect } from "react";
import { NotificationTypesKeys, NotificationTypes } from "types";

export type NotificationStateType = {
  message: string;
  type: NotificationTypesKeys;
};

type NotificationPropsType = {
  onClose: () => void;
} & NotificationStateType;

export const Notification: React.FC<NotificationPropsType> = ({
  message,
  type,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const notificationClasses = `fixed top-4 right-4 p-4 ${
    type === NotificationTypes.error
      ? "bg-red-500"
      : type === NotificationTypes.success
      ? "bg-green-500"
      : "bg-blue-500"
  } text-white rounded shadow ${visible ? "block" : "hidden"}`;

  return (
    <div className={notificationClasses}>
      <p>{message}</p>
    </div>
  );
};

import { Router } from "expo-router";

export type NotificationData = {
  type?: string;
  request_id?: string;
  part_id?: string;
  service_id?: string;
  conversation_id?: string;
  [key: string]: unknown;
};

export function handleNotification(
  router: Router,
  data: NotificationData
) {
  if (!data?.type) {
    console.log(
      "[NotificationHandler] Notification has no type:",
      data
    );

    return;
  }

  console.log(
    "[NotificationHandler] Handling:",
    data.type,
    data
  );

  switch (data.type) {
    case "new_request":
    case "urgent_requests": {
      if (typeof data.request_id === "string") {
        router.push(
          `/(pages)/requests/request/${data.request_id}`
        );
      }

      break;
    }

    case "new_spare_parts": {
      if (typeof data.part_id === "string") {
        router.push(
          `/(pages)/parts/part/${data.part_id}`
        );
      }

      break;
    }

    case "new_services": {
      if (typeof data.service_id === "string") {
        router.push(
          `/(pages)/services/service/${data.service_id}`
        );
      }

      break;
    }

    case "new_messages": {
      router.push("/(root)/(tabs)/inbox");
      break;
    }

    case "app_updates": {
      // No navigation for now.
      // Could later navigate to an Updates screen.
      break;
    }

    case "maintenance_alerts": {
      // No navigation for now.
      break;
    }

    case "system_notifications": {
      // No navigation for now.
      break;
    }

    default:
      console.log(
        "[NotificationHandler] Unhandled notification type:",
        data.type
      );
  }
}
import { supabase } from "@/src/lib/supabase";
import { NotificationType } from "@/types/notifications";


export interface SendNotificationParams {
  userId: string | string[];
  senderId?: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export async function sendNotification({
  userId,
  senderId,
  type,
  title,
  body,
  data = {},
}: SendNotificationParams): Promise<boolean> {
  try {
    // Convert single user or multiple users
    // into one array.
    const recipients = Array.isArray(userId)
      ? userId
      : [userId];

    // Remove the sender from recipients.
    const filteredRecipients = senderId
      ? recipients.filter(
          (id) => id !== senderId
        )
      : recipients;

    // Nothing to send to.
    if (filteredRecipients.length === 0) {
      console.log(
        "[notificationApi] No recipients after excluding sender."
      );

      return true;
    }

    // Send individually to each recipient.
    for (const recipientId of filteredRecipients) {
      const { error } =
        await supabase.functions.invoke(
          "send-notification",
          {
            body: {
              userid: recipientId,
              type,
              title,
              body,
              data: {
                type,
                ...data,
              },
            },
          }
        );

      if (error) {
        console.error(
          `[notificationApi] Failed for ${recipientId}:`,
          error
        );
      }
    }

    return true;
  } catch (error) {
    console.error(
      "[notificationApi] Exception:",
      error
    );

    return false;
  }
}
import { API_BASE_URL } from "./client";
import type { NotificationResponse } from "./types";

export interface NotificationSubscription {
  close: () => void;
}

function encodeStompFrame(command: string, headers: Record<string, string>, body = ""): string {
  const headerLines = Object.entries(headers).map(([key, value]) => `${key}:${value}`);
  return `${command}\n${headerLines.join("\n")}\n\n${body}\0`;
}

export const notificationService = {
  subscribe(userId: string | number, onNotification: (notification: NotificationResponse) => void, onError?: (error: Event) => void): NotificationSubscription {
    const socketUrl = `${API_BASE_URL.replace(/^http/, "ws")}/ws`;
    const socket = new WebSocket(socketUrl);
    const subscriptionId = `notifications-${String(userId)}`;

    socket.addEventListener("open", () => {
      socket.send(encodeStompFrame("CONNECT", { "accept-version": "1.2", host: "localhost" }));
      socket.send(encodeStompFrame("SUBSCRIBE", { id: subscriptionId, destination: `/topic/notifications/${userId}`, ack: "auto" }));
    });
    socket.addEventListener("message", (event) => {
      const frame = String(event.data);
      const separator = frame.indexOf("\n\n");
      if (!frame.startsWith("MESSAGE") || separator < 0) return;
      let body = frame.slice(separator + 2);
      if (body.endsWith("\0")) {
        body = body.slice(0, -1);
      }
      try {
        onNotification(JSON.parse(body) as NotificationResponse);
      } catch {
        onError?.(new Event("Invalid notification payload"));
      }
    });
    socket.addEventListener("error", (event) => onError?.(event));

    return {
      close: () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(encodeStompFrame("UNSUBSCRIBE", { id: subscriptionId }));
          socket.send(encodeStompFrame("DISCONNECT"));
        }
        socket.close();
      },
    };
  },
};

export default notificationService;

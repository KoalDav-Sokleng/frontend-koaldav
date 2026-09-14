// src/features/dashboard/hooks/useDashboardWebSocket.js
import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * WebSocket STOMP client for real-time notifications:
 * - Connects to ws://localhost:8081/ws (with SockJS fallback)
 * - Subscribes to /topic/notifications/{userId}
 * - Dispatches live deadline alerts / updates
 */
export function useDashboardWebSocket(userId = 1, onNotificationReceived) {
  const [connected, setConnected] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);
  const stompClientRef = useRef(null);

  const handleMessage = useCallback((message) => {
    try {
      const payload = JSON.parse(message.body);
      setLatestNotification(payload);
      if (onNotificationReceived) {
        onNotificationReceived(payload);
      }
      // Notify notification bell & other listeners
      window.dispatchEvent(
        new CustomEvent("goal-notification-received", { detail: payload })
      );
    } catch (e) {
      console.error("Failed to parse STOMP message", e);
    }
  }, [onNotificationReceived]);

  useEffect(() => {
    let client = null;
    try {
      const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:8081/ws";

      client = new Client({
        webSocketFactory: () => {
          try {
            return new SockJS(wsUrl);
          } catch {
            return new WebSocket(wsUrl.replace(/^http/, "ws"));
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setConnected(true);
          const topic = `/topic/notifications/${userId}`;
          client.subscribe(topic, handleMessage);
        },
        onDisconnect: () => {
          setConnected(false);
        },
        onStompError: () => {
          setConnected(false);
        },
        onWebSocketError: () => {
          setConnected(false);
        },
      });

      client.activate();
      stompClientRef.current = client;
    } catch (err) {
      console.warn("WebSocket client could not be initialized:", err);
    }

    return () => {
      try {
        if (client && client.active) {
          client.deactivate();
        }
      } catch {
        // ignore
      }
    };
  }, [userId, handleMessage]);

  return { connected, latestNotification };
}

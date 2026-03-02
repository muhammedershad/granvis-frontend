"use client";

import { useCallback, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { getCookie } from "@/lib/cookies";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAuthDetails } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { apiSlice } from "@/lib/api/apiSlice";
import { Notification } from "@/types/notification";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

export function useNotificationSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, user } = useAppSelector(getAuthDetails);
  const dispatch = useAppDispatch();

  const handleNewNotification = useCallback(
    (notification: Notification) => {
      // Show Sonner toast based on notification type
      const toastFnMap: Record<string, typeof toast.info> = {
        error: toast.error,
        warning: toast.warning,
        success: toast.success,
      };
      const toastFn = toastFnMap[notification.type] ?? toast.info;

      toastFn(notification.title, {
        description: notification.message,
        action: notification.actionUrl
          ? {
              label: notification.actionLabel || "View",
              onClick: () => {
                if (notification.actionUrl) {
                  window.location.href = notification.actionUrl;
                }
              },
            }
          : undefined,
      });

      // Invalidate RTK Query cache to refetch notification data
      dispatch(
        apiSlice.util.invalidateTags([
          { type: "Notification", id: "LIST" },
          { type: "Notification", id: "STATS" },
        ])
      );
    },
    [dispatch]
  );

  const handleCountUpdate = useCallback(() => {
    dispatch(
      apiSlice.util.invalidateTags([{ type: "Notification", id: "STATS" }])
    );
  }, [dispatch]);

  const userId = user?._id;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = getCookie("accessToken");
    if (!token) {
      return;
    }

    const socket = io(`${SOCKET_URL}/notifications`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:count", handleCountUpdate);

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, userId, handleNewNotification, handleCountUpdate]);

  return { socket: socketRef.current };
}

// /store/useNotificationStore.ts
import { defineStore } from "pinia";
import type { Notification } from "@/types/notification";
import api from "@/api/axios";

declare global {
  interface Window {
    Echo?: any;
  }
}

export const useNotificationStore = defineStore("notificationStore", {
  state: () => ({
    notifications: [] as Notification[],
    activeChannel: null as any,
    currentUserId: null as number | null,
  }),

  getters: {
    userNotifications: (state) =>
      state.notifications.filter((n) => n.role === "user").slice(0, 10), // Limit to 10 latest

    supportNotifications: (state) =>
      state.notifications.filter((n) => n.role === "support").slice(0, 10), // Limit to 10 latest

    adminNotifications: (state) => state.notifications.slice(0, 10), // Limit to 10 latest
  },

  actions: {
    async fetchNotifications() {
      try {
        const res = await api.get("/api/notifications");
        // Only keep the latest 10 notifications
        this.notifications = res.data.slice(0, 10);
        console.log(
          "Fetching Successful - Loaded",
          this.notifications.length,
          "notifications"
        );
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    },

    async markAsRead(id: number) {
      try {
        await api.patch(`/api/notifications/${id}/read`);
        const notif = this.notifications.find((n) => n.id === id);
        if (notif) notif.read = true;
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },

    async markAllAsRead() {
      try {
        await api.patch("/api/notifications/read-all");
        this.notifications = this.notifications.map((n) => ({
          ...n,
          read: true,
        }));
      } catch (error) {
        console.error("Failed to mark all notifications:", error);
      }
    },

    listenForNotifications(userId: number) {
      if (!window.Echo) {
        console.error("Echo not initialized");
        return;
      }

      // CRITICAL: Prevent duplicate listeners
      if (this.currentUserId === userId && this.activeChannel) {
        console.log("✓ Echo listener already active for user:", userId);
        return;
      }

      // Clean up any existing listener first
      this.stopListening();

      // IMPORTANT: Also cleanup any orphaned channels from HMR
      if (window.Echo?.connector?.channels) {
        Object.keys(window.Echo.connector.channels).forEach((key) => {
          if (key.includes(`user.${userId}`)) {
            console.log("🧹 Cleaning up orphaned channel:", key);
            window.Echo.leave(key.replace("private-", ""));
          }
        });
      }

      console.log("🎧 Setting up Echo listener for user:", userId);
      this.currentUserId = userId;

      // Subscribe to channel
      this.activeChannel = window.Echo.private(`user.${userId}`)
        .listen(".notification.created", (event: any) => {
          console.log("✅ Received notification event:", event);

          // Check for duplicates before adding
          const isDuplicate = this.notifications.some(
            (n) => n.id === event.notification.id
          );

          if (isDuplicate) {
            console.warn(
              "⚠️ Duplicate notification ignored:",
              event.notification.id
            );
            return;
          }

          // Add new notification at the beginning
          this.notifications.unshift(event.notification);

          // Trim to keep only the latest 10 notifications
          if (this.notifications.length > 10) {
            this.notifications = this.notifications.slice(0, 10);
            console.log("✂️ Trimmed notifications to 10 latest");
          }

          console.log(
            "📬 Added notification. Total:",
            this.notifications.length
          );
        })
        .error((error: any) => {
          console.error("❌ Echo subscription error:", error);
        });

      console.log("📡 Active Echo channels:", window.Echo.connector.channels);
    },

    stopListening() {
      if (this.activeChannel && this.currentUserId) {
        console.log("🔇 Stopping Echo listener for user:", this.currentUserId);
        window.Echo.leave(`user.${this.currentUserId}`);
        this.activeChannel = null;
        this.currentUserId = null;
      }
    },

    // Call this when user logs out
    clearNotifications() {
      this.stopListening();
      this.notifications = [];
    },
  },
});

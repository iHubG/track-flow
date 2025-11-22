// /store/useNotificationStore.ts
import { defineStore } from "pinia";
import type { Notification } from "@/types/notification";
import api from "@/api/axios";

export const useNotificationStore = defineStore("notificationStore", {
  state: () => ({
    notifications: [] as Notification[],
  }),

  getters: {
    userNotifications: (state) =>
      state.notifications.filter((n) => n.role === "user"),

    supportNotifications: (state) =>
      state.notifications.filter((n) => n.role === "support"),

    adminNotifications: (state) => state.notifications,
  },

  actions: {
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

    async fetchNotifications() {
      try {
        const res = await api.get("/api/notifications");
        this.notifications = res.data;
        console.log("Fetching Successful");
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    },
  },
});

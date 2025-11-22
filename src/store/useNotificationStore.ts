// /store/useNotificationStore.ts
import { defineStore } from "pinia";
import type { Notification } from "@/types/notification";

export const useNotificationStore = defineStore("notificationStore", {
  state: () => ({
    notifications: [
      {
        id: 1,
        message: "User Sample created a new ticket",
        role: "support",
        time: "2m ago",
        read: false,
      },
      {
        id: 2,
        message: "Support Sample updated your ticket status",
        role: "user",
        time: "1h ago",
        read: true,
      },
      {
        id: 3,
        message: "New user registered",
        role: "admin",
        time: "3h ago",
        read: false,
      },
    ] as Notification[],
  }),

  getters: {
    userNotifications: (state) =>
      state.notifications.filter((n) => n.role === "user"),

    supportNotifications: (state) =>
      state.notifications.filter((n) => n.role === "support"),

    adminNotifications: (state) => state.notifications,
  },

  actions: {
    markAsRead(id: number) {
      const notif = this.notifications.find((n) => n.id === id);
      if (notif) notif.read = true;
    },

    markAllAsRead() {
      this.notifications = this.notifications.map((n) => ({
        ...n,
        read: true,
      }));
    },
  },
});

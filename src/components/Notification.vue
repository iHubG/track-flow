<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";
import { Bell, Check } from "lucide-vue-next";
import { useRouter } from "vue-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/composables/useAuth";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useTimeAgo } from "@/composables/useTimeAgo";
import {
    triggerUserTicketsRefresh,
    triggerAllTicketsRefresh
} from "@/composables/useTicket";
import { useAssignedTickets } from "@/composables/useAssignedTickets";

const { getTimeAgo } = useTimeAgo();
const { user } = useAuth();
const router = useRouter();
const notificationStore = useNotificationStore();
const { refreshAssignedTickets } = useAssignedTickets(user.value?.id || 0);

// DON'T initialize composables here - just import the trigger functions

// Helper to trigger the correct event-based refresh
const triggerRefresh = () => {
    const role = user.value?.role;
    if (role === "user") {
        triggerUserTicketsRefresh();
    } else if (role === "support") {
        refreshAssignedTickets();
    } else {
        triggerAllTicketsRefresh();

    }
};

// Fetch notifications on mount (don't refresh tickets here)
onMounted(async () => {
    try {
        await notificationStore.fetchNotifications();
    } catch (err) {
        console.error("Notification init error:", err);
    }
});

// Ensure Echo listener starts when user becomes available
watch(
    () => user.value?.id,
    (newId, oldId) => {
        // Cleanup old listener if user changed
        if (oldId && newId !== oldId) {
            notificationStore.stopListening();
            notificationStore.clearNotifications();
        }

        if (newId && window.Echo) {
            // Fetch fresh notifications for new user
            notificationStore.fetchNotifications().then(() => {
                // Then start listening
                setTimeout(() => {
                    notificationStore.listenForNotifications(newId);
                }, 500);
            });
        }
    },
    { immediate: true }
);

// Clean up listener when component unmounts
onUnmounted(() => {
    console.log('🗑️ Notification component unmounting - cleaning up');
    notificationStore.stopListening();
});

// Computed lists depending on role
const notifications = computed(() => {
    const role = user.value?.role;
    if (role === "user") return notificationStore.userNotifications;
    if (role === "support") return notificationStore.supportNotifications;
    if (role === "admin") return notificationStore.adminNotifications;
    return [];
});

const notifPath = computed(() => {
    const role = user.value?.role;
    if (role === "user") return "/user/dashboard";
    if (role === "support") return "/support/tickets";
    if (role === "admin") return "/admin/tickets";
    return "/";
});

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);

const markAllRead = () => {
    notificationStore.markAllAsRead();
};

const markAsRead = async (id: number) => {
    try {
        await notificationStore.markAsRead(id);

        // ONLY trigger event-based refresh (don't call direct refresh)
        // This will refresh tickets in ALL mounted components that are listening
        triggerRefresh();

        // then navigate
        router.push(notifPath.value);
    } catch (err) {
        console.error("markAsRead error:", err);
    }
};
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <button class="relative p-2 rounded-full hover:bg-accent cursor-pointer">
                <Bell class="w-5 h-5" />
                <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-80 max-h-[24rem] overflow-y-auto">
            <div class="flex items-center justify-between px-3 py-2">
                <DropdownMenuLabel class="text-base font-semibold">Notifications</DropdownMenuLabel>
                <Button variant="ghost" size="sm" class="text-xs" @click="markAllRead">
                    <Check class="w-4 h-4 mr-1" /> Mark all as read
                </Button>
            </div>
            <DropdownMenuSeparator />

            <div v-if="notifications.length === 0" class="p-4 text-center text-sm text-muted-foreground">
                No notifications
            </div>

            <template v-else>
                <DropdownMenuItem v-for="notif in notifications" :key="notif.id"
                    class="flex flex-col items-start gap-0.5 py-2 px-3 cursor-pointer w-full"
                    @click.stop="markAsRead(notif.id)">
                    <span :class="[notif.read ? 'text-muted-foreground' : 'font-medium']">
                        {{ notif.message }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                        {{ getTimeAgo(notif.created_at) }}
                    </span>
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
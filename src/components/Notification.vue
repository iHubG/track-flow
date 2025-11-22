<script setup lang="ts">
import { computed, onMounted } from "vue";
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

const { getTimeAgo } = useTimeAgo();

onMounted(() => {
    const notificationStore = useNotificationStore();
    notificationStore.fetchNotifications();
});

const { user } = useAuth();
const role = user.value?.role || "guest";
const router = useRouter();

const notificationStore = useNotificationStore();

const notifications = computed(() => {
    if (role === "user") return notificationStore.userNotifications;
    if (role === "support") return notificationStore.supportNotifications;
    if (role === "admin") return notificationStore.adminNotifications;
    return [];
});

const notifPath = computed(() => {
    if (role === "user") return "/user/dashboard";
    if (role === "support") return "/tickets";
    if (role === "admin") return "/tickets";
    return "/";
});

const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read).length
);

const markAllRead = () => {
    notificationStore.markAllAsRead();
};

const markAsRead = (id: number) => {
    notificationStore.markAsRead(id);
    router.push(notifPath.value);
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

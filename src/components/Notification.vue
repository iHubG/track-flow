<script setup lang="ts">
import { ref } from "vue"
import { Bell, Check } from "lucide-vue-next"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { computed } from "vue"

// 🔔 Dummy data (replace later with API or backend)
const notifications = ref([
    { id: 1, title: "New ticket assigned", time: "2m ago", read: false },
    { id: 2, title: "Server maintenance scheduled", time: "1h ago", read: true },
    { id: 3, title: "New user registered", time: "3h ago", read: false },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

// mark all as read
const markAllRead = () => {
    notifications.value = notifications.value.map(n => ({ ...n, read: true }))
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <button class="relative p-2 rounded-full hover:bg-accent cursor-pointer">
                <Bell class="w-5 h-5" />
                <!-- 🔴 Red badge -->
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
                    class="flex flex-col items-start gap-0.5 py-2 px-3 cursor-pointer">
                    <span :class="[notif.read ? 'text-muted-foreground' : 'font-medium']">
                        {{ notif.title }}
                    </span>
                    <span class="text-xs text-muted-foreground">{{ notif.time }}</span>
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

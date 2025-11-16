<script setup lang="ts">
import {
    Home,
    Ticket,
    Users,
} from "lucide-vue-next"

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
    {
        title: "Dashboard",
        url: "/support/dashboard",
        icon: Home,
    },
    {
        title: "Tickets",
        url: "/tickets",
        icon: Ticket,
    },
    {
        title: "Users",
        url: "/manage-users",
        icon: Users,
    },
]
</script>

<template>
    <Sidebar>
        <!-- 🔹 Sidebar Heading -->
        <SidebarHeader class="p-4 border-b border-gray-200">
            <h1 class="text-lg font-semibold tracking-tight text-gray-800">
                Support Desk
            </h1>
            <p class="text-xs text-gray-500">Ticketing System</p>
        </SidebarHeader>

        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in items" :key="item.title">
                            <SidebarMenuButton asChild>
                                <RouterLink :to="item.url"
                                    class="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                                    active-class="text-blue-600 font-medium">
                                    <component :is="item.icon" class="w-4 h-4" />
                                    <span>{{ item.title }}</span>
                                </RouterLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>

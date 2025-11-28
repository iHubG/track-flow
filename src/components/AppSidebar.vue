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
    useSidebar,
} from "@/components/ui/sidebar"

import {
    TooltipProvider,
} from "@/components/ui/tooltip"
import { useAuth } from "@/composables/useAuth"
import { useRoute } from "vue-router"

const { user } = useAuth();
const { state } = useSidebar()
const route = useRoute()

type UserRole = "support" | "admin";

const role = user.value.role as UserRole;

const menuItems: Record<UserRole, Array<{ title: string; url: string; icon: any }>> = {
    support: [
        { title: "Dashboard", url: "/support/dashboard", icon: Home },
        { title: "Tickets", url: "/support/tickets", icon: Ticket },
        { title: "Users", url: "/support/users", icon: Users },
    ],

    admin: [
        { title: "Dashboard", url: "/admin/dashboard", icon: Home },
        { title: "Tickets", url: "/admin/tickets", icon: Ticket },
        { title: "Users", url: "/admin/users", icon: Users },
    ],
};

const items = menuItems[role] ?? [];

const isActive = (url: string) => {
    return route.path === url
}

</script>

<template>
    <Sidebar collapsible="icon">
        <SidebarHeader v-if="state === 'expanded'" class="p-4 border-b border-gray-200">
            <h1 class="text-lg font-semibold tracking-tight text-gray-800">
                {{ role === 'support' ? 'Support Desk' : 'Admin Panel' }}
            </h1>
            <p class="text-xs text-gray-500">Ticketing System</p>
        </SidebarHeader>

        <SidebarContent :class="{ 'pt-2': state === 'collapsed' }">
            <SidebarGroup>
                <SidebarGroupLabel v-if="state === 'expanded'">
                    Main Menu
                </SidebarGroupLabel>

                <SidebarGroupContent>
                    <SidebarMenu>
                        <TooltipProvider>
                            <SidebarMenuItem v-for="item in items" :key="item.title">
                                <SidebarMenuButton :tooltip="item.title" :isActive="isActive(item.url)" asChild>
                                    <RouterLink :to="item.url">
                                        <component :is="item.icon" />
                                        <span>{{ item.title }}</span>
                                    </RouterLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TooltipProvider>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>

    </Sidebar>
</template>
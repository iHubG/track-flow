<script setup lang="ts">
import { onMounted, computed } from "vue"
import { RouterLink } from "vue-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Clock,
    Ticket,
    Plus,
    Activity,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    Minus,
    Tickets
} from "lucide-vue-next"
import { useDashboard } from '@/composables/useDashboard';

import Skeleton from "@/components/ui/skeleton/Skeleton.vue"
import { useAuth } from "@/composables/useAuth"
import { useAssignedTickets } from "@/composables/useAssignedTickets";

const { isAuthenticated, user } = useAuth();
const { dashboardData, loading: dashboardLoading, fetchDashboard } = useDashboard();

onMounted(async () => {
    if (!isAuthenticated.value) return;
    await fetchDashboard();
});

const supportId = user.value.id;
const { tickets, loading: ticketsLoading } = useAssignedTickets(supportId, true);

const stats = computed(() => [
    {
        label: "Total Tickets",
        value: dashboardData.value?.total_assigned_tickets ?? 0,
        icon: Tickets,
        color: "from-blue-500 to-blue-400",
        description: "Assigned tickets",
        change: dashboardData.value?.assigned_change_tickets,
    },
    {
        label: "Total Completed Tickets",
        value: dashboardData.value?.total_completed_assigned_tickets ?? 0,
        icon: Ticket,
        color: "from-orange-500 to-orange-400",
        description: "Completed assigned tickets",
        change: dashboardData.value?.total_completed_assigned_change,
    },
    {
        label: "Pending Tickets",
        value: dashboardData.value?.pending_assigned_tickets ?? 0,
        icon: Clock,
        color: "from-indigo-500 to-indigo-400",
        description: "Open tickets",
        change: dashboardData.value?.pending_assigned_change,
    },
    {
        label: "Active Tickets",
        value: dashboardData.value?.active_assigned_tickets ?? 0,
        icon: Activity,
        color: "from-purple-500 to-purple-400",
        description: "In progress",
        change: dashboardData.value?.active_assigned_change,
    },
    {
        label: "New Tickets Today",
        value: dashboardData.value?.new_assigned_tickets_today ?? 0,
        icon: Plus,
        color: "from-amber-500 to-amber-400",
        description: "Assigned today",
        change: dashboardData.value?.new_assigned_change,
    },

    {
        label: "Resolved Today",
        value: dashboardData.value?.resolved_assigned_tickets_today ?? 0,
        icon: CheckCircle2,
        color: "from-emerald-500 to-emerald-400",
        description: "Closed tickets",
        change: dashboardData.value?.resolved_assigned_change,
    },
]);

// Helper to determine trend icon and color
const getTrendIcon = (change?: number) => {
    if (!change) return Minus;
    return change > 0 ? TrendingUp : TrendingDown;
};

const getTrendColor = (change?: number) => {
    if (!change) return "text-gray-400";
    return change > 0 ? "text-green-600" : "text-red-600";
};

</script>

<template>
    <div class="space-y-8">
        <!-- Page Title  -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-xl font-medium tracking-tight">Suppport Dashboard</h1>
                <p class="text-gray-500 text-sm mt-1">
                    Overview of your ticketing activity and performance.
                </p>
            </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Skeleton Loading -->
            <template v-if="dashboardLoading">
                <Skeleton v-for="n in 6" :key="n" class="h-32 w-full rounded-lg" />
            </template>

            <!-- Actual Cards -->
            <template v-else>
                <Card v-for="(item, i) in stats" :key="i"
                    class="hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
                    <CardHeader class="flex flex-row items-center justify-between pb-2">
                        <div class="flex-1">
                            <CardTitle class="text-sm font-medium text-gray-500">
                                {{ item.label }}
                            </CardTitle>
                            <p class="text-xs text-gray-400 mt-1">{{ item.description }}</p>
                        </div>
                        <div class="p-2.5 rounded-lg bg-gradient-to-br shadow-sm" :class="item.color">
                            <component :is="item.icon" class="w-5 h-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-end justify-between">
                            <p class="text-3xl font-semibold">{{ item.value }}</p>
                            <!-- Optional: Show percentage change -->
                            <div v-if="item.change !== undefined" class="flex items-center text-xs font-medium"
                                :class="getTrendColor(item.change)">
                                <component :is="getTrendIcon(item.change)" class="w-3 h-3 mr-0.5" />
                                {{ item.change ? Math.abs(item.change) : 0 }}%
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </template>
        </div>

        <Card v-if="ticketsLoading" class="border border-gray-100">
            <CardHeader>
                <CardTitle class="text-lg font-semibold">Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton v-for="n in 5" :key="n" class="h-10 w-full rounded-lg mb-2" />
            </CardContent>
        </Card>

        <!-- Recent Tickets -->
        <Card v-else class="border border-gray-100">
            <CardHeader>
                <div class="flex justify-between items-center">
                    <CardTitle class="text-lg font-semibold">Recent Tickets</CardTitle>

                    <RouterLink to="/support/tickets">
                        <Button variant="ghost" class="text-sm text-blue-600 hover:text-blue-700 transition">
                            View All
                        </Button>
                    </RouterLink>

                </div>
            </CardHeader>
            <CardContent>
                <ul class="divide-y divide-gray-200">
                    <li v-for="ticket in tickets.slice(0, 5)" :key="ticket.id"
                        class="py-3 flex justify-between items-center">
                        <div>
                            <p class="font-medium text-gray-800">{{ ticket.title }}</p>
                            <p class="text-sm text-gray-500">
                                Created by {{ ticket.user.name }}
                            </p>
                        </div>

                        <span class="text-xs font-medium px-2.5 py-1 rounded-full capitalize" :class="{
                            'bg-yellow-100 text-yellow-700': ticket.status === 'in_progress',
                            'bg-gray-100 text-gray-700': ticket.status === 'closed',
                            'bg-blue-100 text-blue-700': ticket.status === 'open',
                        }">
                            {{ ticket.status }}
                        </span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    </div>
</template>

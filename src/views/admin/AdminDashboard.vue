<script setup lang="ts">
import { onMounted, computed } from "vue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Users,
    Headphones,
    Ticket,
    Plus,
    Activity,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    Minus
} from "lucide-vue-next"
import { useDashboard } from '@/composables/useDashboard';

import Skeleton from "@/components/ui/skeleton/Skeleton.vue"
import { useAuth } from "@/composables/useAuth"

const { isAuthenticated } = useAuth();
const { dashboardData, loading, fetchDashboard } = useDashboard();

onMounted(async () => {
    if (!isAuthenticated.value) return;
    await fetchDashboard();
});

const stats = computed(() => [
    {
        label: "Total Users",
        value: dashboardData.value?.total_users ?? 0,
        icon: Users,
        color: "from-blue-500 to-blue-400",
        description: "Registered users",
        change: dashboardData.value?.users_change,
    },
    {
        label: "Total Support Agents",
        value: dashboardData.value?.total_support ?? 0,
        icon: Headphones,
        color: "from-indigo-500 to-indigo-400",
        description: "Active support staff",
        change: dashboardData.value?.support_change,
    },
    {
        label: "Total Tickets",
        value: dashboardData.value?.total_tickets ?? 0,
        icon: Ticket,
        color: "from-orange-500 to-orange-400",
        description: "All time tickets",
        change: dashboardData.value?.tickets_change,
    },
    {
        label: "New Tickets Today",
        value: dashboardData.value?.new_tickets_today ?? 0,
        icon: Plus,
        color: "from-amber-500 to-amber-400",
        description: "Created today",
        change: dashboardData.value?.new_change,
    },
    {
        label: "Active Tickets",
        value: dashboardData.value?.active_tickets_today ?? 0,
        icon: Activity,
        color: "from-purple-500 to-purple-400",
        description: "In progress",
        change: dashboardData.value?.active_change,
    },
    {
        label: "Resolved Today",
        value: dashboardData.value?.resolved_tickets_today ?? 0,
        icon: CheckCircle2,
        color: "from-emerald-500 to-emerald-400",
        description: "Closed tickets",
        change: dashboardData.value?.resolved_change,
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
        <!-- Page Title with Refresh Button -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-xl font-medium tracking-tight">Admin Dashboard</h1>
                <p class="text-gray-500 text-sm mt-1">
                    Overview of your ticketing activity and performance.
                </p>
            </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Skeleton Loading -->
            <template v-if="loading">
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

        <!-- Additional Features Section -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Quick Actions -->
            <Card class="border border-gray-100">
                <CardHeader>
                    <CardTitle class="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent class="space-y-2">
                    <button
                        class="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        View All Tickets
                    </button>
                    <button
                        class="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        Manage Users
                    </button>
                    <button
                        class="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        Export Reports
                    </button>
                </CardContent>
            </Card>

            <!-- Recent Activity -->
            <Card class="border border-gray-100">
                <CardHeader>
                    <CardTitle class="text-base">System Status</CardTitle>
                </CardHeader>
                <CardContent class="space-y-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">Average Response Time</span>
                        <span class="font-medium">2.5 hrs</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">Resolution Rate</span>
                        <span class="font-medium text-green-600">94%</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">Customer Satisfaction</span>
                        <span class="font-medium">4.8/5.0</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
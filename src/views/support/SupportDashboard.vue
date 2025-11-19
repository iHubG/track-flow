<script setup lang="ts">
import { ref } from "vue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, Clock, Users } from "lucide-vue-next"

// Dashboard Stats
const stats = ref([
    {
        label: "Total Tickets",
        value: 128,
        icon: Activity,
        color: "from-blue-500 to-blue-400",
    },
    {
        label: "Pending",
        value: 45,
        icon: Clock,
        color: "from-yellow-500 to-yellow-400",
    },
    {
        label: "Resolved",
        value: 78,
        icon: CheckCircle,
        color: "from-green-500 to-green-400",
    },
    {
        label: "Active Agents",
        value: 6,
        icon: Users,
        color: "from-purple-500 to-purple-400",
    },
])

// Sample recent tickets
const tickets = ref([
    { id: 101, title: "Login issue on portal", user: "John Doe", status: "Pending" },
    { id: 102, title: "Unable to reset password", user: "Mary Jane", status: "Resolved" },
    { id: 103, title: "Bug in mobile app", user: "Alex Cruz", status: "Pending" },
    { id: 104, title: "Feature request: Dark mode", user: "Sophia Lee", status: "Open" },
])
</script>

<template>
    <div class="space-y-8">
        <!-- Page Title -->
        <div>
            <h1 class="text-xl font-medium tracking-tight">Support Dashboard</h1>
            <p class="text-gray-500 text-sm mt-1">
                Overview of your ticketing activity and performance.
            </p>
        </div>

        <!-- Stats Section -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card v-for="(item, i) in stats" :key="i"
                class="hover:shadow-md transition-all duration-300 border border-gray-100">
                <CardHeader class="flex flex-row items-center justify-between pb-2">
                    <CardTitle class="text-sm font-medium text-gray-500">
                        {{ item.label }}
                    </CardTitle>
                    <div class="p-2 rounded-lg bg-gradient-to-br" :class="item.color">
                        <component :is="item.icon" class="w-4 h-4 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p class="text-3xl font-semibold mt-2">{{ item.value }}</p>
                </CardContent>
            </Card>
        </div>

        <!-- Recent Tickets -->
        <Card class="border border-gray-100">
            <CardHeader>
                <div class="flex justify-between items-center">
                    <CardTitle class="text-lg font-semibold">Recent Tickets</CardTitle>
                    <button class="text-sm text-blue-600 hover:text-blue-700 transition">
                        View All
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <ul class="divide-y divide-gray-200">
                    <li v-for="ticket in tickets" :key="ticket.id" class="py-3 flex justify-between items-center">
                        <div>
                            <p class="font-medium text-gray-800">{{ ticket.title }}</p>
                            <p class="text-sm text-gray-500">
                                Opened by {{ ticket.user }}
                            </p>
                        </div>

                        <span class="text-xs font-medium px-2.5 py-1 rounded-full capitalize" :class="{
                            'bg-yellow-100 text-yellow-700': ticket.status === 'Pending',
                            'bg-green-100 text-green-700': ticket.status === 'Resolved',
                            'bg-blue-100 text-blue-700': ticket.status === 'Open',
                        }">
                            {{ ticket.status }}
                        </span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    </div>
</template>

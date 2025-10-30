<script setup lang="ts">
import { ref } from "vue"
import { SquarePen, Trash } from "lucide-vue-next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CreateTicketPayload } from "@/types"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import CreateTicket from "@/components/CreateTicket.vue"
import { useTickets } from "@/composables/useTicket"

const { tickets, isLoading, createTicket } = useTickets()
const isDialogOpen = ref(false)

const handleCreateTicket = (data: CreateTicketPayload) => {
    createTicket(data)
    isDialogOpen.value = false
}
</script>

<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-semibold tracking-tight">Tickets</h1>

            <Dialog v-model:open="isDialogOpen">
                <DialogTrigger asChild>
                    <Button class="cursor-pointer">Create Ticket</Button>
                </DialogTrigger>

                <DialogContent class="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create New Ticket</DialogTitle>
                        <DialogDescription>
                            Fill in the form to submit a new ticket.
                        </DialogDescription>
                    </DialogHeader>

                    <CreateTicket @submit="handleCreateTicket" />
                </DialogContent>
            </Dialog>
        </div>

        <div v-if="isLoading" class="text-center text-gray-500">Loading tickets...</div>

        <Card v-else>
            <CardHeader>
                <CardTitle>All Tickets</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm text-left border-collapse">
                        <thead>
                            <tr class="border-b text-gray-500">
                                <th class="py-2 px-3">Ticket ID</th>
                                <th class="py-2 px-3">Title</th>
                                <th class="py-2 px-3">Status</th>
                                <th class="py-2 px-3">Priority</th>
                                <th class="py-2 px-3">Created At</th>
                                <th class="py-2 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ticket in tickets" :key="ticket.id" class="border-b hover:bg-gray-50 transition">
                                <td class="py-2 px-3 font-medium text-gray-800">{{ ticket.id }}</td>
                                <td class="py-2 px-3">{{ ticket.title }}</td>
                                <td class="py-2 px-3">
                                    <Badge :variant="ticket.status === 'closed'
                                        ? 'secondary'
                                        : ticket.status === 'in_progress'
                                            ? 'destructive'
                                            : 'default'">
                                        {{ ticket.status }}
                                    </Badge>
                                </td>
                                <td class="py-2 px-3">
                                    <Badge :variant="ticket.priority === 'high'
                                        ? 'destructive'
                                        : ticket.priority === 'medium'
                                            ? 'secondary'
                                            : 'outline'">
                                        {{ ticket.priority }}
                                    </Badge>
                                </td>
                                <td class="py-2 px-3 text-gray-500">
                                    {{ new Date(ticket.created_at).toLocaleString() }}
                                </td>
                                <td class="py-2 px-3 text-right flex gap-2">
                                    <Button size="sm" variant="outline">
                                        <SquarePen class="text-blue-500" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Trash class="text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

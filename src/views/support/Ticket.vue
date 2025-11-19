<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue"
import { Trash, MoreHorizontal, Clock, CheckCircle, XCircle, ChevronDown } from "lucide-vue-next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TicketPreview, TicketStatus } from "@/types";
import { useToast } from "vue-toastification"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

import CreateTicket from "@/components/CreateTicket.vue"
import DeleteDialog from "@/components/DeleteConfirmationModal.vue"
import FilterTickets from "@/components/FilterTickets.vue"
import { useTickets } from "@/composables/useTicket"
import { deleteTicket } from "@/api/ticket";
import { updateTicket } from "@/api/ticket";

const toast = useToast();
const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false);
const ticketToDelete = ref<number | null>(null);

const { tickets, fetchTickets, loading } = useTickets(true);

const statuses = [
    { label: "Open", value: "open", icon: Clock },
    { label: "In Progress", value: "in_progress", icon: CheckCircle },
    { label: "Closed", value: "closed", icon: XCircle }
];

onMounted(fetchTickets);

// ------------------------------
// Ticket Filters (Status, Priority, Search)
// ------------------------------
const filterStatus = ref("all");
const filterPriority = ref("all");
const filterSearch = ref("");
const debouncedSearch = ref("");
const messageResult = ref("");

let timeout: number;

watch(filterSearch, (val) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        debouncedSearch.value = val;
    }, 300); // 300ms debounce
});

const filteredTickets = computed(() => {
    const results = tickets.value.filter((t) => {
        const statusMatch =
            filterStatus.value === "all" || t.status === filterStatus.value;

        const priorityMatch =
            filterPriority.value === "all" || t.priority === filterPriority.value;

        const searchMatch =
            !debouncedSearch.value ||
            t.title.toLowerCase().includes(debouncedSearch.value.toLowerCase()) ||
            t.description.toLowerCase().includes(debouncedSearch.value.toLowerCase());

        return statusMatch && priorityMatch && searchMatch;
    });

    messageResult.value =
        results.length === 0 ? "No tickets found matching your filters." : "";

    return results;
});



const handleCreateTicket = (newTicket: TicketPreview) => {
    tickets.value.unshift(newTicket);
    toast.success("Ticket created successfully!");
    isDialogOpen.value = false;
};

const currentStatusIcon = (status: string) => {
    const match = statuses.find((s) => s.value === status)
    return match ? match.icon : null
}

const statusColor = (status: string) => {
    switch (status) {
        case "open":
            return "bg-blue-100 text-blue-700 border-blue-300";
        case "in_progress":
            return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "closed":
            return "bg-gray-200 text-gray-700 border-gray-300";
        default:
            return "bg-muted text-foreground border-muted";
    }
};

const updateStatus = async (ticket: TicketPreview, newStatus: TicketStatus) => {
    try {
        await updateTicket(ticket.id, {
            status: newStatus,
        });

        const ticketIndex = tickets.value.findIndex((t) => t.id === ticket.id);
        if (ticketIndex !== -1 && tickets.value[ticketIndex]) {
            tickets.value[ticketIndex].status = newStatus;
        }

        toast.success("Status updated successfully!");
    } catch (error: any) {
        console.error("Failed to update status:", error);
        toast.error("Failed to update status. Please try again.");
    }
};

const handleDeleteTicket = (ticketId: number) => {
    ticketToDelete.value = ticketId;
    isDeleteDialogOpen.value = true;
};

const confirmDelete = async () => {
    if (!ticketToDelete.value) return;

    try {
        await deleteTicket(ticketToDelete.value);
        tickets.value = tickets.value.filter((t) => t.id !== ticketToDelete.value);
        toast.success("Ticket deleted successfully!");
    } catch (error: any) {
        console.error("Failed to delete ticket:", error);
        toast.error("Unable to delete ticket. Please try again.");
    } finally {
        isDeleteDialogOpen.value = false;
        ticketToDelete.value = null;
    }
};
</script>

<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-xl font-medium tracking-tight">Tickets</h1>

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

        <div v-if="loading" class="text-center text-gray-500 text-sm mt-10 lg:mt-20">Loading tickets...</div>

        <Card v-else>
            <CardHeader class="flex items-center justify-between">
                <CardTitle class="text-lg">All Tickets</CardTitle>
                <FilterTickets @update:status="filterStatus = $event" @update:priority="filterPriority = $event"
                    @update:search="filterSearch = $event" />
            </CardHeader>
            <CardContent>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm text-left border-collapse">
                        <thead>
                            <tr class="border-b text-gray-500">
                                <th class="py-2 px-3">ID</th>
                                <th class="py-2 px-3">Ticket ID</th>
                                <th class="py-2 px-3">Title</th>
                                <th class="py-2 px-3">Description</th>
                                <th class="py-2 px-3">Status</th>
                                <th class="py-2 px-3">Priority</th>
                                <th class="py-2 px-3">Created At</th>
                                <th class="py-2 px-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="ticket in filteredTickets" :key="ticket.id"
                                class="border-b hover:bg-gray-50 transition">
                                <td class="py-2 px-3 font-medium text-gray-800">{{ ticket.id }}</td>
                                <td class="py-2 px-3 font-medium text-gray-800">{{ ticket.ticket_id }}</td>
                                <td class="py-2 px-3">{{ ticket.title }}</td>
                                <td class="py-2 px-3 max-w-[200px] truncate" :title="ticket.description">
                                    {{ ticket.description }}
                                </td>

                                <td class="py-2 px-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <div
                                                :class="`flex items-center justify-between w-36 rounded-md px-3 py-1.5 cursor-pointer text-sm hover:opacity-90 border ${statusColor(ticket.status)}`">
                                                <div class="flex-1 flex items-center gap-2 capitalize">
                                                    <component :is="currentStatusIcon(ticket.status)" class="h-4 w-4" />
                                                    {{ ticket.status.replace('_', ' ') }}
                                                </div>

                                                <ChevronDown class="w-4 h-4 opacity-70 ml-2" />
                                            </div>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent class="w-36">
                                            <DropdownMenuItem v-for="s in statuses" :key="s.value"
                                                class="cursor-pointer"
                                                @click="updateStatus(ticket, s.value as TicketStatus)">
                                                <component :is="s.icon" class="mr-2 h-4 w-4" />
                                                <span class="capitalize">{{ s.label }}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>

                                <td class="py-3 px-4">
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
                                <td class="py-2 px-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0">
                                                <MoreHorizontal class="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent class="w-40 mr-5">
                                            <DropdownMenuItem @click="handleDeleteTicket(ticket.id)"
                                                class="cursor-pointer">
                                                <Trash class="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="messageResult" class="text-center text-gray-500 pt-10 pb-8 text-sm w-full">
                        {{ messageResult }}
                    </div>
                </div>
            </CardContent>
        </Card>

        <DeleteDialog v-model="isDeleteDialogOpen" description="This will permanently delete your ticket."
            @confirm="confirmDelete" />
    </div>
</template>

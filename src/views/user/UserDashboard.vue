<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { TicketPreview } from "@/types";
import CardTicket from "@/components/CardTicket.vue";
import Button from "@/components/ui/button/Button.vue";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreateTicket from "@/components/CreateTicket.vue";
import FilterTicket from "@/components/FilterTicket.vue";
import { useToast } from "vue-toastification";
import { deleteTicket } from "@/api/ticket";
import { useUserTickets } from "@/composables/useTicket"; // ✅ add this

const toast = useToast();

const isDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const ticketToDelete = ref<number | null>(null);
const currentFilter = ref<"open" | "in_progress" | "closed">("open");

// ✅ use the composable
const { tickets, fetchTickets, loading } = useUserTickets();

onMounted(() => {
    fetchTickets();
});

// ✅ Computed filters & counts
const counts = computed(() => ({
    open: tickets.value.filter((t) => t.status === "open").length,
    in_progress: tickets.value.filter((t) => t.status === "in_progress").length,
    closed: tickets.value.filter((t) => t.status === "closed").length,
}));

const filteredTickets = computed(() => {
    return tickets.value.filter((t) => t.status === currentFilter.value);
});

const handleFilterChange = (filter: "open" | "in_progress" | "closed") => {
    currentFilter.value = filter;
};

const handleCreateTicket = (newTicket: TicketPreview) => {
    tickets.value.unshift(newTicket);
    toast.success("Ticket created successfully!");
    isDialogOpen.value = false;
};

// ✅ Open delete confirmation modal
const handleDeleteTicket = (ticketId: number) => {
    ticketToDelete.value = ticketId;
    isDeleteDialogOpen.value = true;
};

// ✅ Confirm deletion
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
    <section class="py-4 px-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div class="w-xl flex justify-between">
                <h2 class="text-2xl font-semibold">My Tickets</h2>

                <FilterTicket :counts="counts" @change-filter="handleFilterChange" />
            </div>

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

        <div v-if="loading" class="max-w-xl text-center text-gray-500 text-sm mt-10">Loading tickets...</div>
        <div v-else-if="filteredTickets.length" class="grid gap-4">
            <CardTicket v-for="t in filteredTickets" :key="t.id" :ticket="t" @delete="handleDeleteTicket" />
        </div>
        <p v-else class="max-w-xl text-center text-gray-500 text-sm mt-10">
            No tickets found for this filter.
        </p>

        <!-- ✅ Delete Confirmation Modal -->
        <AlertDialog v-model:open="isDeleteDialogOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your ticket.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="confirmDelete" class="bg-red-600 hover:bg-red-700">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </section>
</template>
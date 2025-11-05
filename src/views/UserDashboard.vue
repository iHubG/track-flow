<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import type { TicketPreview } from "@/types"
import CardTicket from "@/components/CardTicket.vue"
import Button from "@/components/ui/button/Button.vue"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import CreateTicket from "@/components/CreateTicket.vue"
import FilterTicket from "@/components/FilterTicket.vue"

// ✅ Toast for feedback
import { useToast } from "vue-toastification"
const toast = useToast()

// ✅ Import backend API
import { getUserTickets } from "@/api/ticket"

const isDialogOpen = ref(false)
const tickets = ref<TicketPreview[]>([])
const currentFilter = ref<"open" | "in_progress" | "closed">("open")

// ✅ Fetch user tickets on page load
onMounted(async () => {
    try {
        const response = await getUserTickets()
        tickets.value = Array.isArray(response)
            ? response
            : response.data || []
    } catch (error: any) {
        console.error("Failed to load tickets:", error)
        toast.error("Unable to fetch your tickets.")
    }
})

// ✅ Computed filters & counts
const counts = computed(() => ({
    open: tickets.value.filter((t) => t.status === "open").length,
    in_progress: tickets.value.filter((t) => t.status === "in_progress").length,
    closed: tickets.value.filter((t) => t.status === "closed").length,
}))

const filteredTickets = computed(() => {
    return tickets.value.filter((t) => t.status === currentFilter.value)
})

const handleFilterChange = (filter: "open" | "in_progress" | "closed") => {
    currentFilter.value = filter
}

const handleCreateTicket = (newTicket: TicketPreview) => {
    console.log("📥 Parent received ticket:", newTicket)
    console.log("📋 Current tickets before:", tickets.value.length)

    tickets.value.unshift(newTicket)

    console.log("📋 Current tickets after:", tickets.value.length)
    console.log("🎯 New tickets array:", tickets.value)

    toast.success("Ticket created successfully!")
    isDialogOpen.value = false
}
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

        <div v-if="filteredTickets.length" class="grid gap-4">
            <CardTicket v-for="t in filteredTickets" :key="t.id" :ticket="t" />
        </div>

        <p v-else class="max-w-xl text-center text-gray-500 text-sm mt-10">
            No tickets found for this filter.
        </p>
    </section>
</template>

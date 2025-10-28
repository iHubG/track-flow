<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TicketPreview } from '@/types'
import CardTicket from '@/components/CardTicket.vue'
import Button from '@/components/ui/button/Button.vue'

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'

import CreateTicket from '@/components/CreateTicket.vue'
import FilterTicket from '@/components/FilterTicket.vue'

import { useToast } from "vue-toastification"
const toast = useToast()

const isDialogOpen = ref(false)

const tickets = ref<TicketPreview[]>([
    {
        id: 10,
        title: 'Cannot update profile image',
        status: 'in_progress',
        priority: 'medium',
        created_at: '2025-10-18T09:25:00Z',
    },
    {
        id: 11,
        title: 'Login not working on mobile',
        status: 'open',
        priority: 'high',
        created_at: '2025-10-19T08:00:00Z',
    },
    {
        id: 12,
        title: 'Feature request: Dark mode',
        status: 'closed',
        priority: 'low',
        created_at: '2025-10-20T12:30:00Z',
    },
])

const currentFilter = ref<'open' | 'in_progress' | 'closed'>('open')

const counts = computed(() => ({
    open: tickets.value.filter(t => t.status === 'open').length,
    in_progress: tickets.value.filter(t => t.status === 'in_progress').length,
    closed: tickets.value.filter(t => t.status === 'closed').length,
}))

const filteredTickets = computed(() => {
    return tickets.value.filter(t => t.status === currentFilter.value)
})


const handleFilterChange = (filter: 'open' | 'in_progress' | 'closed') => {
    currentFilter.value = filter
}

const handleCreateTicket = (data: { title: string; description: string; priority: TicketPreview['priority'] }) => {
    const newTicket: TicketPreview = {
        id: Date.now(),
        title: data.title,
        priority: data.priority,
        status: 'open',
        created_at: new Date().toISOString(),
    }

    tickets.value.unshift(newTicket)
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

        <p v-else class="text-center text-gray-500 text-sm mt-6">
            No tickets found for this filter.
        </p>
    </section>
</template>

<script setup lang="ts">
import type { TicketPreview } from '@/types'
import { Clock, Trash } from 'lucide-vue-next'

const props = defineProps<{
    ticket: TicketPreview
}>()

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}
</script>

<template>
    <div
        class="group w-full max-w-xl rounded-xl border bg-white p-4 shadow-sm transition-transform hover:shadow-md hover:-translate-y-0.5">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
                <div class="text-xs font-mono text-gray-500 mb-1">
                    {{ props.ticket.ticket_id }}
                </div>
                <h2 class="text-base font-semibold line-clamp-2 text-gray-800" :title="props.ticket.title">
                    {{ props.ticket.title }}
                </h2>
            </div>
            <div class="flex items-center gap-2">
                <span :class="[
                    'px-2 py-0.5 rounded-full text-[11px] font-medium capitalize',
                    props.ticket.status === 'open' && 'bg-green-100 text-green-700',
                    props.ticket.status === 'in_progress' && 'bg-yellow-100 text-yellow-700',
                    props.ticket.status === 'closed' && 'bg-red-100 text-red-700',
                ]">
                    {{ props.ticket.status.replace('_', ' ') }}
                </span>
                <!-- Delete button - shows on hover -->
                <button @click.stop="$emit('delete', props.ticket.id)"
                    class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 cursor-pointer"
                    title="Delete ticket">
                    <Trash class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Meta Info -->
        <div class="flex justify-between items-center text-xs text-gray-500 mt-1">
            <!-- Priority badge -->
            <span :class="[
                'px-2 py-0.5 rounded-full font-medium capitalize',
                props.ticket.priority === 'low' && 'bg-green-100 text-green-700',
                props.ticket.priority === 'medium' && 'bg-orange-100 text-orange-700',
                props.ticket.priority === 'high' && 'bg-red-100 text-red-700',
            ]">
                {{ props.ticket.priority }}
            </span>

            <!-- Date -->
            <div class="flex items-center gap-1">
                <Clock class="w-3.5 h-3.5" />
                <span>{{ formatDate(props.ticket.created_at) }}</span>
            </div>
        </div>
    </div>
</template>
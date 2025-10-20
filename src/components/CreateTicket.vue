<script setup lang="ts">
import { ref } from 'vue'
import type { TicketPreview } from '@/types'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Button from './ui/button/Button.vue'

const emit = defineEmits<{
    (e: 'submit', payload: { title: string; description: string; priority: TicketPreview['priority'] }): void
}>()

const title = ref('')
const description = ref('')
const priority = ref<TicketPreview['priority'] | ''>('')
const errors = ref<{ title?: string; description?: string; priority?: string }>({})

const validateForm = () => {
    const newErrors: { title?: string; description?: string; priority?: string } = {}

    if (!title.value.trim()) {
        newErrors.title = 'Title is required.'
    } else if (title.value.length < 5) {
        newErrors.title = 'Title must be at least 5 characters.'
    } else if (title.value.length > 100) {
        newErrors.title = 'Title must not exceed 100 characters.'
    }

    if (!description.value.trim()) {
        newErrors.description = 'Description is required.'
    } else if (description.value.length < 10) {
        newErrors.description = 'Description must be at least 10 characters.'
    }

    const validPriorities: TicketPreview['priority'][] = ['low', 'medium', 'high']
    if (!priority.value) newErrors.priority = 'Priority is required.'
    else if (!validPriorities.includes(priority.value as TicketPreview['priority'])) {
        newErrors.priority = 'Invalid priority selected.'
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
    if (!validateForm()) return

    emit('submit', {
        title: title.value,
        description: description.value,
        priority: priority.value as TicketPreview['priority'],
    })

    title.value = ''
    description.value = ''
    priority.value = ''
    errors.value = {}
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="w-full mx-auto space-y-6">
        <div>
            <Input v-model="title" type="text" placeholder="Title"
                :class="[errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500']" />
            <span v-if="errors.title" class="text-xs text-red-500 mt-1 px-1">{{ errors.title }}</span>
        </div>

        <div>
            <Textarea v-model="description" placeholder="Description"
                :class="[errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500']" />
            <span v-if="errors.description" class="text-xs text-red-500 mt-1 px-1">{{ errors.description }}</span>
        </div>

        <div>
            <Select v-model="priority">
                <SelectTrigger class="w-full" :class="[errors.priority ? 'border-red-500' : 'border-gray-300']">
                    <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <span v-if="errors.priority" class="text-xs text-red-500 mt-1 px-1">{{ errors.priority }}</span>
        </div>

        <Button type="submit" class="w-full cursor-pointer">
            Create Ticket
        </Button>
    </form>
</template>

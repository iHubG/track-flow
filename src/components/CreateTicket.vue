<script setup lang="ts">
import type { TicketPreview } from "@/types"
import { useCreateTicket } from "@/composables/useCreateTicket"
import { useToast } from "vue-toastification"

// ✅ Shadcn UI imports
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
import { Button } from "@/components/ui/button"

// ✅ Toast for feedback
const toast = useToast()

// ✅ Define emits (to notify parent of successful creation)
const emit = defineEmits<{
    (e: "submit", newTicket: TicketPreview): void
}>()

// ✅ Use the composable
const { title, description, priority, errors, loading, handleSubmit } =
    useCreateTicket()

// ✅ Handle form submit with error handling
const onSubmit = async () => {
    try {
        console.log("🚀 Submitting ticket...")
        const ticket = await handleSubmit()
        console.log("✅ Ticket received from API:", ticket)

        if (ticket) {
            console.log("📤 Emitting ticket to parent:", ticket)
            emit("submit", ticket)
        } else {
            console.warn("⚠️ No ticket returned from handleSubmit")
        }
    } catch (error: any) {
        console.error("❌ Failed to create ticket:", error)
        toast.error(error.response?.data?.message || "Failed to create ticket")
    }
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="w-full mx-auto space-y-6">
        <!-- Title -->
        <div>
            <Input v-model="title" type="text" placeholder="Title" :disabled="loading" :class="[
                errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-emerald-500',
            ]" />
            <span v-if="errors.title" class="text-xs text-red-500 mt-1 px-1">{{ errors.title }}</span>
        </div>

        <!-- Description -->
        <div>
            <Textarea v-model="description" placeholder="Description" :disabled="loading" :class="[
                errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-emerald-500',
            ]" />
            <span v-if="errors.description" class="text-xs text-red-500 mt-1 px-1">{{ errors.description }}</span>
        </div>

        <!-- Priority -->
        <div>
            <Select v-model="priority" :disabled="loading">
                <SelectTrigger class="w-full cursor-pointer"
                    :class="[errors.priority ? 'border-red-500' : 'border-gray-300']">
                    <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="low" class="cursor-pointer">Low</SelectItem>
                        <SelectItem value="medium" class="cursor-pointer">Medium</SelectItem>
                        <SelectItem value="high" class="cursor-pointer">High</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <span v-if="errors.priority" class="text-xs text-red-500 mt-1 px-1">{{ errors.priority }}</span>
        </div>

        <!-- Submit -->
        <Button type="submit" class="w-full cursor-pointer" :disabled="loading">
            {{ loading ? "Creating..." : "Create Ticket" }}
        </Button>
    </form>
</template>
<script setup lang="ts">
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
    SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getSupportUsers } from '@/api/users'
import { ref, onMounted } from 'vue'
import type { User } from '@/types/user'

const props = defineProps<{
    ticketId: number
    isAssigning?: boolean   // 👈 parent controls loading state
}>()

const emit = defineEmits(['assign'])

const supportUsers = ref<User[]>([])
const selectedUserId = ref<string | null>(null)

onMounted(async () => {
    supportUsers.value = await getSupportUsers()
})

function assignUser() {
    if (!selectedUserId.value) return
    emit('assign', {
        ticketId: props.ticketId,
        userId: Number(selectedUserId.value)
    })
}
</script>

<template>
    <div class="p-4 flex flex-col gap-4">
        <Select v-model="selectedUserId">
            <SelectTrigger class="w-full">
                <SelectValue placeholder="Select Support User" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Support Users</SelectLabel>
                    <SelectItem v-for="user in supportUsers" :key="user.id" :value="user.id.toString()">
                        {{ user.name }}
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>

        <Button class="w-full" @click="assignUser" :disabled="props.isAssigning">
            {{ props.isAssigning ? 'Assigning...' : 'Assign User' }}
        </Button>
    </div>
</template>

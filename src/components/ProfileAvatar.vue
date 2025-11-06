<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

const { isAuthenticated, user, checkAuth, logout } = useAuth()
const isLoggedIn = computed(() => isAuthenticated.value)

onMounted(async () => {
    await checkAuth()
})

const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
})
</script>


<template>
    <DropdownMenu v-if="isLoggedIn">
        <DropdownMenuTrigger as-child>
            <button class="flex items-center gap-2 focus:outline-none cursor-pointer">
                <div
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white font-semibold">
                    {{ userInitials }}
                </div>
                <span class="hidden sm:inline text-sm font-medium text-gray-700">
                    {{ user?.name }}
                </span>
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="w-48" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem as="router-link" to="/settings" class="cursor-pointer">
                Profile Settings
            </DropdownMenuItem>

            <DropdownMenuItem @click="logout" class="cursor-pointer">
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
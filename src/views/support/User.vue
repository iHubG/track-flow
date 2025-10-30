<script setup lang="ts">
import { ref, computed } from "vue"

// Temporary sample data — replace with API call later
const users = ref([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Support", status: "Active" },
    { id: 3, name: "Michael Cruz", email: "michael@example.com", role: "User", status: "Inactive" },
    { id: 4, name: "Sarah Tan", email: "sarah@example.com", role: "User", status: "Active" },
])

const search = ref("")

const filteredUsers = computed(() => {
    const term = search.value.toLowerCase()
    return users.value.filter(
        (u) =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.role.toLowerCase().includes(term)
    )
})
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Manage Users</h2>
            <input v-model="search" type="text" placeholder="Search users..."
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition">
                        <td class="px-6 py-3 text-sm font-medium text-gray-800">{{ user.name }}</td>
                        <td class="px-6 py-3 text-sm text-gray-600">{{ user.email }}</td>
                        <td class="px-6 py-3 text-sm">
                            <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                user.role === 'Admin'
                                    ? 'bg-blue-100 text-blue-700'
                                    : user.role === 'Support'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                            ]">
                                {{ user.role }}
                            </span>
                        </td>
                        <td class="px-6 py-3 text-sm">
                            <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                user.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                            ]">
                                {{ user.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

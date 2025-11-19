<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import Button from "@/components/ui/button/Button.vue";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import FilterUsers from "@/components/FilterUsers.vue";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, ChevronDown, CircleDot, CircleOff } from "lucide-vue-next";

import type { UserStatus, User } from "@/types";
import { useUsers } from "@/composables/useUsers"; // ✅ corrected
import { deleteUser, updateUserStatus } from "@/api/users"; // ✅ corrected
import { useToast } from "vue-toastification";
import DeleteDialog from "@/components/DeleteConfirmationModal.vue";

// composable values
const { users, fetchUsers, loading } = useUsers(true);

const toast = useToast();

const isDeleteDialogOpen = ref(false);
const userToDelete = ref<number | null>(null);

const statuses = [
    { label: "Active", value: "active", icon: CircleDot },
    { label: "Inactive", value: "inactive", icon: CircleOff },
];

// fetch on load
onMounted(fetchUsers);

// filters
const filterStatus = ref("all");
const filterRole = ref("all");
const filterSearch = ref("");
const debouncedSearch = ref("");
const messageResult = ref("");

let timeout: number;

// debounce search
watch(filterSearch, (val) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        debouncedSearch.value = val;
    }, 300);
});

// filter logic
const filteredUsers = computed(() => {
    const results = users.value.filter((u) => {
        const statusMatch =
            filterStatus.value === "all" || u.status === filterStatus.value;

        const roleMatch =
            filterRole.value === "all" || u.role === filterRole.value;

        const searchMatch =
            !debouncedSearch.value ||
            u.name.toLowerCase().includes(debouncedSearch.value.toLowerCase()) ||
            u.role.toLowerCase().includes(debouncedSearch.value.toLowerCase());

        return statusMatch && roleMatch && searchMatch;
    });

    messageResult.value =
        results.length === 0 ? "No users found matching your filters." : "";

    return results;
});

// icon resolver
const currentStatusIcon = (status: string) => {
    const match = statuses.find((s) => s.value === status);
    return match ? match.icon : null;
};

// status label style
const statusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-emerald-100 text-emerald-700";
        case "inactive":
            return "bg-red-100 text-red-700";
        default:
            return "bg-muted text-foreground border-muted";
    }
};

// ==========================================
// 🔹 UPDATE USER STATUS
// ==========================================
const updateStatus = async (user: User, newStatus: UserStatus) => {
    try {
        await updateUserStatus(user.id, newStatus);

        const idx = users.value.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
            const existing = users.value[idx];
            if (existing) {
                existing.status = newStatus;
            }
        }

        toast.success("User status updated successfully!");
    } catch (error) {
        console.error(error);
        toast.error("Failed to update user status.");
    }
};

// ==========================================
// 🔹 DELETE USER
// ==========================================
const handleDeleteUser = (userId: number) => {
    userToDelete.value = userId;
    isDeleteDialogOpen.value = true;
};

const confirmDelete = async () => {
    if (!userToDelete.value) return;

    try {
        const { message } = await deleteUser(userToDelete.value);

        users.value = users.value.filter((u) => u.id !== userToDelete.value);

        toast.success(message);
    } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to delete user.");
    } finally {
        isDeleteDialogOpen.value = false;
        userToDelete.value = null;
    }
};

</script>


<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-medium">Manage Users</h2>
            <Button>
                Create New User
            </Button>
        </div>


        <div v-if="loading" class="text-center text-gray-500 text-sm mt-10 lg:mt-20">Loading users...</div>

        <Card v-else>
            <CardHeader class="flex items-center justify-between">
                <CardTitle class="text-lg">All Users</CardTitle>
                <FilterUsers @update:status="filterStatus = $event" @update:role="filterRole = $event"
                    @update:search="filterSearch = $event" />
            </CardHeader>
            <CardContent>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm text-left border-collapse">
                        <thead>
                            <tr class="border-b text-gray-500">
                                <th class="py-2 px-3">ID</th>
                                <th class="py-2 px-3">Name</th>
                                <th class="py-2 px-3">Email</th>
                                <th class="py-2 px-3">Status</th>
                                <th class="py-2 px-3">Role</th>
                                <th class="py-2 px-3">Created At</th>
                                <th class="py-2 px-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="user in filteredUsers" :key="user.id"
                                class="border-b hover:bg-gray-50 transition">
                                <td class="py-2 px-3 font-medium text-gray-800">{{ user.id }}</td>
                                <td class="py-2 px-3">{{ user.name }}</td>
                                <td class="py-2 px-3">{{ user.email }}</td>

                                <td class="py-2 px-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <div
                                                :class="`flex items-center justify-between w-36 rounded-md px-3 py-1.5 cursor-pointer text-sm hover:opacity-90 border ${statusColor(user.status)}`">
                                                <div class="flex-1 flex items-center gap-2 capitalize">
                                                    <component :is="currentStatusIcon(user.status)" class="h-4 w-4" />
                                                    {{ user.status.replace('_', ' ') }}
                                                </div>

                                                <ChevronDown class="w-4 h-4 opacity-70 ml-2" />
                                            </div>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent class="w-36">
                                            <DropdownMenuItem v-for="s in statuses" :key="s.value"
                                                class="cursor-pointer"
                                                @click="updateStatus(user, s.value as UserStatus)">
                                                <component :is="s.icon" class="mr-2 h-4 w-4" />
                                                <span class="capitalize">{{ s.label }}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>

                                <td class="px-6 py-3 text-sm">
                                    <span :class="[
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        user.role === 'admin'
                                            ? 'bg-blue-100 text-blue-700'
                                            : user.role === 'support'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                    ]">
                                        {{ user.role }}
                                    </span>
                                </td>
                                <td class="py-2 px-3 text-gray-500">
                                    {{ new Date(user.created_at).toLocaleString() }}
                                </td>
                                <td class="py-2 px-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0">
                                                <MoreHorizontal class="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent class="w-40 mr-5">
                                            <DropdownMenuItem @click="handleDeleteUser(user.id)" class="cursor-pointer">
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

<script setup lang="ts">
import { ref, watch } from "vue";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const status = ref("");
const role = ref("");
const search = ref("");

const emit = defineEmits(["update:status", "update:role", "update:search"]);

watch(status, (v) => emit("update:status", v));
watch(role, (v) => emit("update:role", v));
watch(search, (v) => emit("update:search", v));
</script>

<template>
    <div class="flex items-center gap-4">

        <!-- Search Bar -->
        <input v-model="search" type="text" placeholder="Search users"
            class="border rounded-md px-3 py-[6px] text-base w-56" />

        <!-- Status Filter -->
        <Select v-model="status">
            <SelectTrigger class="w-40">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
        </Select>

        <!-- Priority Filter -->
        <Select v-model="role">
            <SelectTrigger class="w-40">
                <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
        </Select>
    </div>
</template>

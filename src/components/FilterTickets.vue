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
const priority = ref("");
const search = ref("");

const emit = defineEmits(["update:status", "update:priority", "update:search"]);

watch(status, (v) => emit("update:status", v));
watch(priority, (v) => emit("update:priority", v));
watch(search, (v) => emit("update:search", v));
</script>

<template>
    <div class="flex items-center gap-4">

        <!-- Search Bar -->
        <input v-model="search" name="search" placeholder="Search tickets"
            class="border rounded-md px-3 py-[6px] text-base w-56" autocomplete="off" />

        <!-- Status Filter -->
        <Select v-model="status">
            <SelectTrigger class="w-40">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
        </Select>

        <!-- Priority Filter -->
        <Select v-model="priority">
            <SelectTrigger class="w-40">
                <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
            </SelectContent>
        </Select>


    </div>
</template>

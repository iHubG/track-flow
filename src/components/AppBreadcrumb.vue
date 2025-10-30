<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { computed } from 'vue'

const route = useRoute()

const currentPage = computed(() => {
    return route.meta?.breadcrumb || route.meta?.title || route.name || 'Current Page'
})
</script>

<template>
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbPage>{{ currentPage }}</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
</template>

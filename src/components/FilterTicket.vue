<script setup lang="ts">
import { ref } from 'vue'
import Button from './ui/button/Button.vue'

type FilterType = 'all' | 'open' | 'in_progress' | 'closed'

const props = defineProps<{
    counts: Record<FilterType, number>
}>()

const emit = defineEmits<{
    (e: 'change-filter', value: FilterType): void
}>()

const activeFilter = ref<FilterType>('all')

const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Closed', value: 'closed' },
]

const handleFilterClick = (filter: FilterType) => {
    activeFilter.value = filter
    emit('change-filter', filter)
}
</script>

<template>
    <div class="flex gap-2 flex-wrap">
        <Button v-for="f in filters" :key="f.value" variant="outline" @click="handleFilterClick(f.value)" :class="[
            activeFilter === f.value
                ? 'bg-primary text-white border-primary'
                : 'text-gray-600'
        ]">
            {{ f.label }} ({{ props.counts[f.value] }})
        </Button>
    </div>
</template>

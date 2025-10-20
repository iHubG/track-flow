<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { MoveLeft } from 'lucide-vue-next';
</script>
<template>
    <div class="flex items-center justify-center h-screen">
        <div class="max-w-lg w-lg mx-auto shadow bg-emerald-200 rounded px-15 py-10 flex flex-col gap-5 text-center">
            <h2 class="text-6xl font-semibold text-gray-900">Opps!</h2>
            <p class="text-2xl font-medium text-gray-800">404 Not Found</p>
            <div class="flex gap-2 items-center justify-center mt-5">
                <Button>
                    <MoveLeft class="w-4 h-4 mr-1 text-emerald-100"/>
                    <RouterLink to="/">Go to Home</RouterLink>
                </Button>
            </div>

        </div>
    </div>

</template>
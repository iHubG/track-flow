<script setup lang="ts">
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaRegularEye, FaRegularEyeSlash } from 'oh-vue-icons/icons'
import Button from './ui/button/Button.vue'
import { useAuthForm } from '@/composables/useAuthForm'

addIcons(FaRegularEye, FaRegularEyeSlash)

const props = defineProps({
    mode: { type: String, required: true },
})

const {
    name,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    loading,
    errors,
    handleSubmit,
} = useAuthForm(props.mode as 'login' | 'register')
</script>

<template>
    <div class="max-w-sm mx-auto py-10">
        <h1 class="text-3xl font-bold text-emerald-600 mb-8 text-center">
            {{ props.mode === 'register' ? 'Create an Account' : 'Login' }}
        </h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
            <div v-if="props.mode === 'register'" class="flex flex-col gap-1">
                <label for="name" class="text-sm font-medium text-gray-700">Name</label>
                <input v-model="name" id="name" placeholder="John Doe" :class="[
                    'py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all',
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                ]" />
                <span v-if="errors.name" class="text-xs text-red-500 mt-1 px-1">{{ errors.name }}</span>
            </div>

            <div class="flex flex-col gap-1">
                <label for="email" class="text-sm font-medium text-gray-700">Email</label>
                <input v-model="email" id="email" type="email" placeholder="hello@example.com" :class="[
                    'py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all',
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                ]" />
                <span v-if="errors.email" class="text-xs text-red-500 mt-1 px-1">{{ errors.email }}</span>
            </div>

            <div class="flex flex-col gap-1">
                <label for="password" class="text-sm font-medium text-gray-700">Password</label>
                <div class="relative">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password"
                        placeholder="••••••••" :class="[
                            'w-full py-2 px-3 pr-10 rounded-md border focus:ring-2 focus:outline-none transition-all',
                            errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                        ]" />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600">
                        <OhVueIcon :name="showPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'" scale="1.2" />
                    </button>
                </div>
                <span v-if="errors.password" class="text-xs text-red-500 mt-1 px-1">{{ errors.password }}</span>
            </div>

            <div v-if="props.mode === 'register'" class="flex flex-col gap-1">
                <label for="confirmPassword" class="text-sm font-medium text-gray-700">Confirm Password</label>
                <div class="relative">
                    <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                        placeholder="••••••••" :class="[
                            'w-full py-2 px-3 pr-10 rounded-md border focus:ring-2 focus:outline-none transition-all',
                            errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                        ]" />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600">
                        <OhVueIcon :name="showConfirmPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'"
                            scale="1.2" />
                    </button>
                </div>
                <span v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1 px-1">{{ errors.confirmPassword
                    }}</span>
            </div>

            <Button type="submit"
                class="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="loading">
                <template v-if="loading">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>{{ props.mode === 'register' ? 'Creating account...' : 'Logging in...' }}</span>
                </template>
                <template v-else>
                    {{ props.mode === 'register' ? 'Register' : 'Login' }}
                </template>
            </Button>
        </form>
    </div>
</template>

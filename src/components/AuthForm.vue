<script setup lang="ts">
import { ref } from 'vue'
import Button from './ui/button/Button.vue'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaRegularEye, FaRegularEyeSlash } from 'oh-vue-icons/icons'
addIcons(FaRegularEye, FaRegularEyeSlash)

const props = defineProps({
    mode: {
        type: String,
        required: true,
    },
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errors = ref<{ email?: string; password?: string }>({})

const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email.value) {
        newErrors.email = 'Email is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        newErrors.email = 'Enter a valid email address.'
    }

    if (!password.value) {
        newErrors.password = 'Password is required.'
    } else if (password.value.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.'
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
    if (!validateForm()) return

    if (props.mode === 'register') {
        console.log('Registering with:', email.value, password.value)
    } else {
        console.log('Logging in with:', email.value, password.value)
    }

    email.value = ''
    password.value = ''
    errors.value = {}
}
</script>

<template>
    <div class="max-w-sm mx-auto py-10">
        <h1 class="text-3xl font-bold text-emerald-600 mb-8 text-center">
            {{ props.mode === 'register' ? 'Create an Account' : 'Login' }}
        </h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
            <!-- Email -->
            <div class="flex flex-col gap-1">
                <label for="email" class="text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" v-model="email" placeholder="hello@example.com" :class="[
                    'py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all',
                    errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-emerald-500'
                ]" />
                <span v-if="errors.email" class="text-xs text-red-500 mt-1 px-1">{{ errors.email }}</span>
            </div>

            <!-- Password with toggle -->
            <div class="flex flex-col gap-1">
                <label for="password" class="text-sm font-medium text-gray-700">Password</label>
                <div class="relative">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                        placeholder="••••••••" :class="[
                            'w-full py-2 px-3 pr-10 rounded-md border focus:ring-2 focus:outline-none transition-all',
                            errors.password
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-emerald-500'
                        ]" />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600 focus:outline-none">
                        <OhVueIcon v-if="!showPassword" name="fa-regular-eye" scale="1.2" />
                        <OhVueIcon v-else name="fa-regular-eye-slash" scale="1.2" />
                    </button>
                </div>
                <span v-if="errors.password" class="text-xs text-red-500 mt-1 px-1">{{ errors.password }}</span>
            </div>

            <!-- Submit -->
            <Button type="submit"
                class="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md transition">
                {{ props.mode === 'register' ? 'Register' : 'Login' }}
            </Button>
        </form>
    </div>
</template>

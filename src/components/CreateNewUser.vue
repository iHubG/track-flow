<script setup lang="ts">
import type { User } from "@/types"
import { useCreateUser } from "@/composables/useCreateUser"
import { useToast } from "vue-toastification"
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaRegularEye, FaRegularEyeSlash } from 'oh-vue-icons/icons'

// Shadcn UI
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Add icons
addIcons(FaRegularEye, FaRegularEyeSlash)

const toast = useToast()

// Emit when user is successfully created
const emit = defineEmits<{
    (e: "submit", newUser: User): void
}>()

// Use composable (no "mode")
const {
    name,
    email,
    role,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    errors,
    loading,
    handleSubmit,
} = useCreateUser()

// Handle form submission
const onSubmit = async () => {
    try {
        const user = await handleSubmit()

        if (user) {
            emit("submit", user)
        }
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to create user")
    }
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="w-full mx-auto space-y-6">
        <!-- Name -->
        <div>
            <Input v-model="name" type="text" placeholder="Name" :disabled="loading" :class="[
                errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-emerald-500',
            ]" />
            <span v-if="errors.name" class="text-xs text-red-500 mt-1 px-1">{{ errors.name }}</span>
        </div>

        <!-- Email -->
        <div>
            <Input v-model="email" type="email" placeholder="Email" :disabled="loading" :class="[
                errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-emerald-500',
            ]" />
            <span v-if="errors.email" class="text-xs text-red-500 mt-1 px-1">{{ errors.email }}</span>
        </div>

        <!-- Role -->
        <div>
            <Select v-model="role" :disabled="loading">
                <SelectTrigger class="w-full cursor-pointer"
                    :class="[errors.role ? 'border-red-500' : 'border-gray-300']">
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Role</SelectLabel>

                        <SelectItem value="admin" class="cursor-pointer">Admin</SelectItem>
                        <SelectItem value="support" class="cursor-pointer">Support</SelectItem>
                        <SelectItem value="user" class="cursor-pointer">User</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <span v-if="errors.role" class="text-xs text-red-500 mt-1 px-1">
                {{ errors.role }}
            </span>
        </div>


        <!-- Password -->
        <div>
            <div class="relative">
                <Input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password"
                    :disabled="loading" class="pr-10" :class="[
                        errors.password
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-emerald-500',
                    ]" />
                <button type="button" @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600"
                    :disabled="loading">
                    <OhVueIcon :name="showPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'" scale="1.2" />
                </button>
            </div>
            <span v-if="errors.password" class="text-xs text-red-500 mt-1 px-1">{{ errors.password }}</span>
        </div>

        <!-- Confirm Password -->
        <div>
            <div class="relative">
                <Input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                    placeholder="Confirm Password" :disabled="loading" class="pr-10" :class="[
                        errors.confirmPassword
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-emerald-500',
                    ]" />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600"
                    :disabled="loading">
                    <OhVueIcon :name="showConfirmPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'" scale="1.2" />
                </button>
            </div>
            <span v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1 px-1">{{ errors.confirmPassword
            }}</span>
        </div>

        <!-- Submit -->
        <Button type="submit" class="w-full cursor-pointer" :disabled="loading">
            {{ loading ? "Creating..." : "Create User" }}
        </Button>
    </form>
</template>
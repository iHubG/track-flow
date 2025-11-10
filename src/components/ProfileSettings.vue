<script setup lang="ts">
import { ref, computed } from "vue"
import { useAuth } from '@/composables/useAuth'
import { useProfile } from "@/composables/useProfile"
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaRegularEye, FaRegularEyeSlash } from 'oh-vue-icons/icons'

addIcons(FaRegularEye, FaRegularEyeSlash)


const { user } = useAuth()
const {
    name,
    currentPassword,
    newPassword,
    showCurrentPassword,
    showNewPassword,
    isLoading,
    errors,
    successMessage,
    handleUpdate,
    validateForm,
    clearError,
    resetForm
} = useProfile()

// Initialize name from user
name.value = user.value.name
const email = ref(user.value.email)

const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
        .split(' ')
        .map((n: string) => n)
        .join('')
        .toUpperCase()
})

const firstUpper = user.value.role.charAt(0).toUpperCase();

const handleSaveProfile = async () => {
    const success = await handleUpdate()
    if (success) {
        console.log("✅ Profile updated successfully")
    }
}

</script>

<template>
    <div class="py-4 px-6 space-y-4">
        <!-- Header -->
        <div>
            <h2 class="text-xl font-semibold">Personal Settings</h2>
            <p class="text-sm text-gray-500">Manage your profile, password, and preferences</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <section class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 focus:outline-none cursor-pointer">
                        <div
                            class="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white font-semibold">
                            {{ userInitials }}
                        </div>
                        <span class="text-sm font-medium text-gray-700">
                            {{ user?.name }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500">Role: {{ firstUpper + user.role.substring(1, user.role.length) }}
                    </p>
                </div>

                <div class="flex flex-col gap-4">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input v-model="email" type="email" disabled
                            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input v-model="name" type="text"
                            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <button @click="handleSaveProfile"
                    class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Save Profile
                </button>
            </section>

            <!-- Password Change -->
            <section class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                <h3 class="text-lg font-medium">Change Password</h3>

                <!-- Current Password -->
                <div class="flex flex-col gap-1">
                    <label for="currentPassword" class="text-sm font-medium text-gray-700">Current Password</label>
                    <div class="relative">
                        <input :type="showCurrentPassword ? 'text' : 'password'" v-model="currentPassword"
                            id="currentPassword" placeholder="••••••••" :class="[
                                'w-full py-2 px-3 pr-10 rounded-md border focus:ring-2 focus:outline-none transition-all',
                                errors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                            ]" />
                        <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600">
                            <OhVueIcon :name="showCurrentPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'"
                                scale="1.2" />
                        </button>
                    </div>
                    <span v-if="errors.currentPassword" class="text-xs text-red-500 mt-1 px-1">{{ errors.currentPassword
                        }}</span>
                </div>

                <!-- New Password -->
                <div class="flex flex-col gap-1">
                    <label for="newPassword" class="text-sm font-medium text-gray-700">New Password</label>
                    <div class="relative">
                        <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" id="newPassword"
                            placeholder="••••••••" :class="[
                                'w-full py-2 px-3 pr-10 rounded-md border focus:ring-2 focus:outline-none transition-all',
                                errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                            ]" />
                        <button type="button" @click="showNewPassword = !showNewPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600">
                            <OhVueIcon :name="showNewPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'"
                                scale="1.2" />
                        </button>
                    </div>
                    <span v-if="errors.newPassword" class="text-xs text-red-500 mt-1 px-1">{{ errors.newPassword
                        }}</span>
                </div>

                <button @click="handleUpdate" :disabled="isLoading"
                    class="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                    {{ isLoading ? 'Updating...' : 'Update Password' }}
                </button>

                <!-- Success message -->
                <div v-if="successMessage" class="text-green-600 text-sm mt-2">
                    {{ successMessage }}
                </div>
            </section>
        </div>
    </div>
</template>

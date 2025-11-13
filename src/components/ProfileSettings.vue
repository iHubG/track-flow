<script setup lang="ts">
import { ref, computed } from "vue"
import { useAuth } from '@/composables/useAuth'
import { useProfile } from "@/composables/useProfile"
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaRegularEye, FaRegularEyeSlash } from 'oh-vue-icons/icons'
import { useToast } from "vue-toastification"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

addIcons(FaRegularEye, FaRegularEyeSlash)

const { user, fetchUser } = useAuth()
const toast = useToast();

const {
    name,
    currentPassword,
    newPassword,
    newPasswordConfirmation,
    showCurrentPassword,
    showNewPassword,
    showNewPasswordConfirmation,
    isLoadingProfile,
    isLoadingPassword,
    isLoadingDelete,
    errors,
    handleUpdateProfile,
    handleChangePassword,
    handleDeleteAccount,
} = useProfile()

// Initialize name from user
name.value = user.value.name
const email = ref(user.value.email)

const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
})

const firstUpper = user.value.role.charAt(0).toUpperCase();

const handleSaveProfile = async () => {
    const success = await handleUpdateProfile()
    if (success) {
        // Refresh user data from backend to sync the state
        await fetchUser();
        toast.success("Profile updated successfully!");
    } else {
        toast.error("Failed to update profile");
    }
}

const handleSavePassword = async () => {
    const success = await handleChangePassword()
    if (success) {
        toast.success("Password changed successfully!");
    } else {
        toast.error("Failed to change password");
    }
}

const handleConfirmDelete = async () => {
    const success = await handleDeleteAccount()
    if (success) {
        toast.success("Account deleted successfully");
        // Redirect to login or home page
        // router.push('/login')
    } else {
        toast.error("Failed to delete account");
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

            <!-- Profile Section -->
            <section class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
                <h3 class="text-lg font-medium">Profile Information</h3>

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
                    <!-- Email (disabled) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input v-model="email" type="email" disabled
                            class="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none" />
                        <p class="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input v-model="name" type="text" :class="[
                            'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2',
                            errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]" />
                        <span v-if="errors.name" class="text-xs text-red-500 mt-1 px-1">{{ errors.name }}</span>
                    </div>
                </div>

                <button @click="handleSaveProfile" :disabled="isLoadingProfile"
                    class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {{ isLoadingProfile ? 'Saving...' : 'Save Changes' }}
                </button>
            </section>

            <!-- Password Change Section -->
            <section class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                <h3 class="text-lg font-medium">Change Password</h3>

                <!-- Current Password -->
                <div class="flex flex-col gap-1">
                    <label for="currentPassword" class="text-sm font-medium text-gray-700">Current Password</label>
                    <div class="relative">
                        <input :type="showCurrentPassword ? 'text' : 'password'" v-model="currentPassword"
                            id="currentPassword" placeholder="••••••••" :class="[
                                'w-full py-2 px-3 pr-10 rounded-md border focus:ring-2 focus:outline-none transition-all',
                                errors.current_password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                            ]" />
                        <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600">
                            <OhVueIcon :name="showCurrentPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'"
                                scale="1.2" />
                        </button>
                    </div>
                    <span v-if="errors.current_password" class="text-xs text-red-500 mt-1 px-1">{{
                        errors.current_password }}</span>
                </div>

                <!-- New Password -->
                <div class="flex flex-col gap-1">
                    <label for="newPassword" class="text-sm font-medium text-gray-700">New Password</label>
                    <div class="relative">
                        <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" id="newPassword"
                            placeholder="••••••••" :class="[
                                'w-full py-2 px-3 pr-10 rounded-md border focus:ring-2 focus:outline-none transition-all',
                                errors.new_password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                            ]" />
                        <button type="button" @click="showNewPassword = !showNewPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600">
                            <OhVueIcon :name="showNewPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'"
                                scale="1.2" />
                        </button>
                    </div>
                    <span v-if="errors.new_password" class="text-xs text-red-500 mt-1 px-1">{{ errors.new_password
                    }}</span>
                </div>

                <!-- New Password Confirmation -->
                <div class="flex flex-col gap-1">
                    <label for="newPasswordConfirmation" class="text-sm font-medium text-gray-700">Confirm New
                        Password</label>
                    <div class="relative">
                        <input :type="showNewPasswordConfirmation ? 'text' : 'password'"
                            v-model="newPasswordConfirmation" id="newPasswordConfirmation" placeholder="••••••••"
                            :class="[
                                'w-full py-2 px-3 pr-10 rounded-md border focus:ring-2 focus:outline-none transition-all',
                                errors.new_password_confirmation ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                            ]" />
                        <button type="button" @click="showNewPasswordConfirmation = !showNewPasswordConfirmation"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600">
                            <OhVueIcon :name="showNewPasswordConfirmation ? 'fa-regular-eye-slash' : 'fa-regular-eye'"
                                scale="1.2" />
                        </button>
                    </div>
                    <span v-if="errors.new_password_confirmation" class="text-xs text-red-500 mt-1 px-1">{{
                        errors.new_password_confirmation }}</span>
                </div>

                <button @click="handleSavePassword" :disabled="isLoadingPassword"
                    class="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {{ isLoadingPassword ? 'Updating...' : 'Update Password' }}
                </button>
            </section>
        </div>

        <!-- Danger Zone -->
        <section class="bg-white border border-red-200 rounded-xl shadow-sm p-6 space-y-4">
            <div>
                <h3 class="text-lg font-medium text-red-600">Danger Zone</h3>
                <p class="text-sm text-gray-500 mt-1">Irreversible actions that affect your account</p>
            </div>

            <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                    <h4 class="text-sm font-medium text-gray-900">Delete Account</h4>
                    <p class="text-xs text-gray-600 mt-1">Permanently delete your account and all associated data</p>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger as-child>
                        <button :disabled="isLoadingDelete"
                            class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Delete Account
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove all your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction @click="handleConfirmDelete" :disabled="isLoadingDelete"
                                class="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                                {{ isLoadingDelete ? 'Deleting...' : 'Delete Account' }}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue"

// Mock user data — replace with API calls later
const user = ref({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Support",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    notifications: true,
})

// Editable fields
const name = ref(user.value.name)
const email = ref(user.value.email)
const password = ref("")
const notifications = ref(user.value.notifications)

const handleSaveProfile = () => {
    console.log("Profile saved:", { name: name.value, email: email.value })
    // TODO: send PUT request to backend API
}

const handleChangePassword = () => {
    console.log("Password updated:", password.value)
    // TODO: send PATCH request to backend API
}

const handleToggleNotifications = () => {
    user.value.notifications = notifications.value
    console.log("Notifications toggled:", notifications.value)
    // TODO: update notification preference in backend
}
</script>

<template>
    <div class="space-y-8">
        <!-- Header -->
        <div>
            <h2 class="text-xl font-semibold">Personal Settings</h2>
            <p class="text-sm text-gray-500">Manage your profile, password, and preferences</p>
        </div>

        <!-- Profile Info -->
        <section class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
            <div class="flex items-center gap-4">
                <img :src="user.avatar" alt="User Avatar" class="w-16 h-16 rounded-full border border-gray-300" />
                <div>
                    <h3 class="text-lg font-medium">{{ user.name }}</h3>
                    <p class="text-sm text-gray-500">{{ user.role }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input v-model="name" type="text"
                        class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="email" type="email"
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
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input v-model="password" type="password" placeholder="••••••••"
                    class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button @click="handleChangePassword"
                class="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
                Update Password
            </button>
        </section>

        <!-- Notifications -->
        <section class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <h3 class="text-lg font-medium">Notifications</h3>
            <div class="flex items-center gap-3">
                <input id="notifications" type="checkbox" v-model="notifications" @change="handleToggleNotifications"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label for="notifications" class="text-sm text-gray-700">
                    Receive email and in-app notifications
                </label>
            </div>
        </section>
    </div>
</template>

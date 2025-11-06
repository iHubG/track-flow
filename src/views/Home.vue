<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, checkAuth, user } = useAuth()

onMounted(async () => {
  await checkAuth()
})

const isLoggedIn = computed(() => isAuthenticated.value)
</script>

<template>
  <div class="flex items-center justify-center bg-white py-20 min-h-[80vh]">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center text-center px-6">
      <h2 class="text-4xl font-bold text-gray-800 mb-4">
        Welcome to <span class="text-emerald-600">TrackFlow</span>
      </h2>

      <p class="text-gray-600 max-w-lg mb-8">
        A simple and efficient issue tracking system built with Laravel and Vue. <br />
        Report bugs, manage tickets, and collaborate seamlessly.
      </p>

      <div class="flex gap-4">
        <!-- Show these if not logged in -->
        <template v-if="!isLoggedIn">
          <RouterLink to="/register">
            <button class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg cursor-pointer">
              Get Started
            </button>
          </RouterLink>

          <RouterLink to="/login">
            <button
              class="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-2 rounded-lg cursor-pointer">
              Login
            </button>
          </RouterLink>
        </template>

        <!-- Show this if logged in -->
        <template v-else>
          <RouterLink :to="user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'support' ? '/support/dashboard'
            : '/user/dashboard'">
            <button class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg cursor-pointer">
              Go to Dashboard
            </button>
          </RouterLink>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Button from '@/components/ui/button/Button.vue'
import Notification from '@/components/Notification.vue'

// ✅ ShadCN dropdown components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const { isAuthenticated, user, checkAuth, logout } = useAuth()

const isLoginPage = computed(() => route.path === '/login')
const isLoggedIn = computed(() => isAuthenticated.value)
const detectedRole = computed(() => user?.value.role === 'admin' ? '/admin' : user?.value.role === 'support' ? '/support'
  : '/user')

const dashboardPath = computed(() => {
  if (user?.value.role === 'admin') return '/admin/dashboard'
  if (user?.value.role === 'support') return '/support/dashboard'
  return '/user/dashboard'
})

// ✅ Check if user is on any authenticated user page (dashboard or other pages)
const isOnUserPages = computed(() => {
  return route.path.startsWith('/user/') ||
    route.path === `${detectedRole}'/profile-settings'`
})

onMounted(async () => {
  if (user.value || localStorage.getItem('user')) {
    checkAuth().catch(() => {
      // Failed to verify, clear state
      user.value = null;
      localStorage.removeItem('user');
    });
  }
})

const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
})
</script>

<template>
  <header class="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4 border-b">
    <h1 class="text-2xl font-bold text-emerald-600">TrackFlow</h1>

    <nav class="flex gap-3 items-center">
      <!-- Guest links -->
      <div v-if="!isLoggedIn" class="flex gap-3">
        <RouterLink :to="isLoginPage ? '/' : '/login'">
          <Button variant="outline" class="text-emerald-600 border-emerald-600 hover:text-emerald-600">
            {{ isLoginPage ? 'Home' : 'Login' }}
          </Button>
        </RouterLink>

        <RouterLink to="/register">
          <Button class="bg-emerald-600 hover:bg-emerald-700 text-white">
            Register
          </Button>
        </RouterLink>
      </div>

      <!-- Authenticated user -->
      <div v-else class="flex items-center gap-4 lg:gap-6">
        <!-- ✅ Show Dashboard button only when NOT on user pages -->
        <template v-if="!isOnUserPages">

          <RouterLink :to="dashboardPath">
            <Button class="bg-emerald-600 hover:bg-emerald-700 text-white">
              Dashboard
            </Button>
          </RouterLink>
        </template>

        <!-- ✅ Show avatar dropdown when on user pages (dashboard, profile-settings, etc.) -->
        <template v-else>
          <RouterLink :to="dashboardPath" v-if="route.path === `${detectedRole}/profile-settings`">
            <Button class="bg-emerald-600 hover:bg-emerald-700 text-white">
              Dashboard
            </Button>
          </RouterLink>
          <Notification />
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button class="flex items-center gap-2 focus:outline-none cursor-pointer">
                <div
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white font-semibold">
                  {{ userInitials }}
                </div>
                <span class="hidden sm:inline text-sm font-medium text-gray-700">
                  {{ user?.name }}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-48" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem class="cursor-pointer">
                <RouterLink to="/user/profile-settings" class="w-full h-full">
                  Profile Settings
                </RouterLink>
              </DropdownMenuItem>

              <DropdownMenuItem @click="logout" class="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
      </div>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Button from '@/components/ui/button/Button.vue'

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
const isDashboardPage = computed(() => route.path === '/user')
const isLoggedIn = computed(() => isAuthenticated.value)

onMounted(async () => {
  await checkAuth()
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
      <div v-else class="flex items-center gap-4">
        <!-- ✅ Show only Dashboard button when NOT on the dashboard -->
        <template v-if="!isDashboardPage">
          <RouterLink :to="user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'support' ? '/support/dashboard'
            : '/user/dashboard'">
            <Button class="bg-emerald-600 hover:bg-emerald-700 text-white">
              Dashboard
            </Button>
          </RouterLink>
        </template>

        <!-- ✅ Show avatar dropdown only on dashboard page -->
        <template v-else>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button class="flex items-center gap-2 focus:outline-none">
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

              <DropdownMenuItem as="router-link" to="/settings">
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem @click="logout">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
      </div>
    </nav>
  </header>
</template>

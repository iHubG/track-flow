<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import Button from '@/components/ui/button/Button.vue'

const route = useRoute()
const isLoggedIn = ref(false)

const isLoginPage = computed(() => route.path === '/login')
const isDashboardPage = computed(() => route.path === '/user')
</script>

<template>
  <header class="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4 border-b">
    <h1 class="text-2xl font-bold text-emerald-600">
      TrackFlow
    </h1>

    <nav class="flex gap-3">
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

      <div v-else>
        <template v-if="isDashboardPage">
          <v-icon name="fa-user-circle" class="w-8 h-8 cursor-pointer" />
        </template>

        <template v-else>
          <RouterLink to="/user">
            <Button class="bg-emerald-600 hover:bg-emerald-700 text-white">
              Dashboard
            </Button>
          </RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

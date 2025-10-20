<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue';
import { Avatar } from '@/components/ui/avatar'


const route = useRoute()
const isLoginPage = route.path === '/login'
const isLoggedIn = ref(false);

</script>


<template>
  <header class="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4 border-b">
    <h1 class="text-2xl font-bold text-emerald-600">
      TrackFlow
    </h1>
    <nav class="flex gap-3">
      <div v-if="isLoggedIn">
        <RouterLink :to="isLoginPage ? '/' : '/login'">
          <button
            class="text-emerald-600 border border-emerald-600 hover:bg-emerald-50 px-5 py-2 rounded-lg cursor-pointer">
            {{ isLoginPage ? 'Home' : 'Login' }}
          </button>
        </RouterLink>

        <RouterLink to="/register">
          <button class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg cursor-pointer">
            Register
          </button>
        </RouterLink>
      </div>
      <div v-else>
        <Avatar>
          <v-icon name="fa-user-circle" class="w-8 h-8 cursor-pointer" />
        </Avatar>

      </div>

    </nav>
  </header>
</template>

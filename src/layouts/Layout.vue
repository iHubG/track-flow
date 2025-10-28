<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar.vue"

const route = useRoute()

const showNavbar = computed(() => {
  return route.path === '/user' || route.path === '/'
})
</script>

<template>
  <div>
    <div v-if="showNavbar">
      <Navbar />
      <main class="p-4">
        <RouterView />
      </main>
    </div>

    <SidebarProvider v-else>
      <div class="flex min-h-screen">
        <AppSidebar />
        <main class="flex-1 p-4">
          <SidebarTrigger class="mb-4" />
          <RouterView />
        </main>
      </div>
    </SidebarProvider>
  </div>
</template>

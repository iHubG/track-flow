<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar.vue"
import AppBreadcrumb from "@/components/AppBreadcrumb.vue"
import Notification from '@/components/Notification.vue'

const route = useRoute()

const showNavbar = computed(() => {
  return route.path === '/user' || route.path === '/' || route.path === '/login' || route.path === '/register'
})
</script>

<template>
  <div>
    <!-- Layout with Navbar -->
    <div v-if="showNavbar">
      <Navbar />
      <main class="p-4">
        <RouterView />
      </main>
    </div>

    <SidebarProvider v-else>
      <div class="flex min-h-screen w-full">
        <!-- Sidebar (fixed left section) -->
        <AppSidebar />

        <!-- Main content area -->
        <div class="flex flex-col flex-1 min-h-screen">
          <!-- Header on top of main -->
          <header class="flex items-center justify-between gap-5 border-b border-gray-200 p-4 w-full">
            <div class="flex gap-5 items-center">
              <SidebarTrigger />
              <AppBreadcrumb />
            </div>
            <Notification />
          </header>

          <!-- Main page content -->
          <main class="flex-1 p-4 overflow-auto">
            <RouterView />
          </main>
        </div>
      </div>
    </SidebarProvider>

  </div>
</template>

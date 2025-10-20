<script setup lang="ts">

</script>

<template>
  <div class="flex items-center justify-center bg-white py-25">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center flex-grow text-center">
      <h2 class="text-4xl font-bold text-gray-800 mb-4">
        Welcome to <span class="text-emerald-600">TrackFlow</span>
      </h2>
      <p class="text-gray-600 max-w-lg mb-8">
        A simple and efficient issue tracking system built with Laravel and Vue.
        Report bugs, manage tickets, and collaborate seamlessly.
      </p>
      <div class="flex gap-4">
        <RouterLink to="/register">
          <Button class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg cursor-pointer">
            Get Started
          </Button>
        </RouterLink>
        <RouterLink to="/login">
          <Button
            class="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-2 rounded-lg cursor-pointer">
            Login
          </Button>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

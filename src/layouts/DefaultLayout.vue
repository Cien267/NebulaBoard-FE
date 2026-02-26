<template>
  <div class="min-h-screen h-auto bg-gray-50 flex flex-col">
    <!-- Header -->
    <AppHeader />
    <AppMenu />

    <div class="flex flex-1">
      <!-- Main Content -->
      <main class="min-h-[calc(100vh-80px)] flex-1 flex flex-col grow relative">
        <slot />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layouts/AppHeader.vue'
import AppMenu from '@/components/layouts/AppMenu.vue'
import AppFooter from '@/components/layouts/AppFooter.vue'
</script>

<style scoped></style>

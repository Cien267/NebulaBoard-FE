<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="(route?.meta?.transition as string) || ''" mode="out-in">
      <div :key="route.path">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

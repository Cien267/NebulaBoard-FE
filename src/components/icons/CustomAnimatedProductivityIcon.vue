<script lang="ts" setup>
import Image from 'primevue/image'
import clock from '@/assets/images/clock.apng'
import cogwheel from '@/assets/images/cogwheel.apng'
</script>

<template>
  <div class="relative w-30 h-30 bg-white rounded-full">
    <Image
      :src="clock"
      alt="Image"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-999"
    />
    <Image
      :src="cogwheel"
      alt="Image"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      width="250"
    />
  </div>
</template>

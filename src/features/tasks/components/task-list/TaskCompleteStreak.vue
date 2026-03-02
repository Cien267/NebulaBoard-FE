<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../../types'

const { groupedTasks } = defineProps(['groupedTasks'])

const streak = computed(() => {
  if (!Array.isArray(groupedTasks) || groupedTasks.length === 0) return 0

  let streak = 0

  for (const day of groupedTasks) {
    if (!day.tasks || day.tasks.length === 0) break

    const allDone = day.tasks.every((task: Task) => task.status === 'done')

    if (!allDone) break

    streak++
  }

  return streak
})
</script>

<template>
  <div class="flex items-center justify-center gap-1">
    <img v-if="streak > 0" src="../../../../assets/images/streak.svg" alt="" class="h-6 w-auto" />
    <img v-else src="../../../../assets/images/empty-streak.svg" alt="" class="h-6 w-auto" />
    <span class="font-bold text-2xl" :class="{ 'text-orange-500': streak > 0 }">{{ streak }}</span>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

const { selectedStatus } = defineProps(['selectedStatus'])
const emit = defineEmits(['open-create-dialog'])
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300"
  >
    <div
      class="bg-slate-200 rounded-full p-5 h-16 w-16 flex justify-center items-center mb-4 shadow-inner"
    >
      <i class="pi pi-inbox text-5xl text-slate-400"></i>
    </div>
    <p class="text-xl font-bold text-slate-700">No tasks found</p>
    <p class="text-base mt-2 max-w-sm text-center">
      There are no tasks matching your current filter.
      <span v-if="selectedStatus === 'all'">Create a new task to get started.</span>
    </p>
    <Button
      v-if="selectedStatus === 'all'"
      label="Create Task"
      icon="pi pi-plus"
      class="mt-6 rounded-xl"
      @click="emit('open-create-dialog')"
    />
  </div>
</template>

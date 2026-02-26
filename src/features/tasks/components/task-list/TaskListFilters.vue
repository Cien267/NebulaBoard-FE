<script setup lang="ts">
import { TASK_STATUSES } from '../../constants'

const { selectedStatus } = defineProps(['selectedStatus'])
const emit = defineEmits(['handleFilter'])
</script>
<template>
  <aside class="w-full md:w-64 shrink-0 rounded-2xl p-5 flex flex-col gap-4">
    <h3 class="text-lg font-bold text-slate-900 mb-2">Filters</h3>

    <div class="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
      <button
        v-for="status in TASK_STATUSES"
        :key="status"
        @click="emit('handleFilter', status as any)"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left font-medium whitespace-nowrap cursor-pointer"
        :class="[
          selectedStatus === status
            ? 'bg-sky-100 text-sky-600 '
            : 'text-slate-600 hover:bg-slate-100',
        ]"
      >
        <i
          class="pi"
          :class="[
            status === 'all'
              ? 'pi-list'
              : status === 'todo'
                ? 'pi-circle'
                : status === 'in_progress'
                  ? 'pi-spin pi-spinner'
                  : 'pi-check-circle',
          ]"
        ></i>
        <span class="capitalize">{{ status.replace('_', ' ') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '../../constants'

const { selectedStatus, selectedPriority } = defineProps(['selectedStatus', 'selectedPriority'])
const emit = defineEmits(['handleFilterByStatus', 'handleFilterByPriority'])

const FILTER_STATUSES = [{ value: 'all', label: 'All' }, ...TASK_STATUS_OPTIONS]
const FILTER_PRIORITIES = [{ value: 'all', label: 'All' }, ...TASK_PRIORITY_OPTIONS]
</script>
<template>
  <aside
    class="w-full md:w-64 shrink-0 p-5 flex flex-col gap-4 border-r-2 border-r-slate-200 space-y-6"
  >
    <h3 class="text-lg font-bold text-slate-900">Filters</h3>

    <div class="space-y-3">
      <h4 class="text-lg font-normal text-slate-900">Status</h4>
      <div class="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
        <button
          v-for="status in FILTER_STATUSES"
          :key="status.value"
          @click="emit('handleFilterByStatus', status.value as any)"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left font-medium whitespace-nowrap cursor-pointer"
          :class="[
            selectedStatus === status.value
              ? 'bg-sky-100 text-sky-600 '
              : 'text-slate-600 hover:bg-slate-100',
          ]"
        >
          <i
            class="pi"
            :class="[
              status.value === 'all'
                ? 'pi-list'
                : status.value === 'todo'
                  ? 'pi-circle'
                  : status.value === 'in_progress'
                    ? 'pi-spin pi-spinner'
                    : 'pi-check-circle',
            ]"
          ></i>
          <span>{{ status.label }}</span>
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <h4 class="text-lg font-normal text-slate-900">Priority</h4>
      <div class="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
        <button
          v-for="priority in FILTER_PRIORITIES"
          :key="priority.value"
          @click="emit('handleFilterByPriority', priority.value as any)"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left font-medium whitespace-nowrap cursor-pointer"
          :class="[
            selectedPriority === priority.value
              ? 'bg-sky-100 text-sky-600 '
              : 'text-slate-600 hover:bg-slate-100',
          ]"
        >
          <i
            class="pi"
            :class="[
              priority.value === 'low'
                ? 'pi-minus'
                : priority.value === 'medium'
                  ? 'pi-angle-up'
                  : priority.value === 'high'
                    ? 'pi-angle-double-up'
                    : 'pi-list',
            ]"
          ></i>
          <span>{{ priority.label }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

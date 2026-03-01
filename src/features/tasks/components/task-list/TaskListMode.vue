<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { liveQuery } from 'dexie'
import { db } from '../../db/taskDb'
import type { Task, TaskStatusFilterType, TaskPriorityFilterType } from '../../types'
import dayjs from 'dayjs'
import TaskListFilters from './TaskListFilters.vue'
import TaskListEmptyState from './TaskListEmptyState.vue'
import Button from 'primevue/button'
import UpsertTask from './UpsertTask.vue'
import TaskItem from './TaskItem.vue'

const tasks = ref<Task[]>([])
let subscription: any = null

onMounted(() => {
  subscription = liveQuery(() => db.tasks.toArray()).subscribe({
    next: (result) => {
      tasks.value = result
    },
    error: (err) => console.error(err),
  })
})

onUnmounted(() => {
  if (subscription) subscription.unsubscribe()
})

const selectedStatus = ref<TaskStatusFilterType>('all')
const selectedPriority = ref<TaskPriorityFilterType>('all')
const upsertTaskRef = ref()

const groupedTasks = computed(() => {
  const groups: Record<string, Task[]> = {}

  tasks.value.forEach((task) => {
    // filter by status
    if (selectedStatus.value !== 'all' && task.status !== selectedStatus.value) {
      return
    }

    // filter by priority
    if (selectedPriority.value !== 'all' && task.priority !== selectedPriority.value) {
      return
    }

    const dateStr = dayjs(task.createdDate).format('YYYY-MM-DD')
    if (!groups[dateStr]) groups[dateStr] = []
    groups[dateStr].push(task)
  })

  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a)) // newer first
    .map((date) => {
      const dateTasks = groups[date]!
      const total = dateTasks.length
      const done = dateTasks.filter((t) => t.status === 'done').length
      const progress = total === 0 ? 0 : Math.round((done / total) * 100)

      const isToday = dayjs().format('YYYY-MM-DD') === date
      const isYesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD') === date
      let title = dayjs(date).format('MMMM D, YYYY')
      if (isToday) title = 'Today'
      else if (isYesterday) title = 'Yesterday'

      return {
        date,
        title,
        progress,
        total,
        done,
        tasks: dateTasks.sort((a, b) => b.createdDate - a.createdDate),
      }
    })
})
</script>

<template>
  <div
    class="flex flex-col md:flex-row gap-16 h-full md:justify-between items-start w-full transition-all duration-300"
  >
    <!-- Left Sidebar: Filters -->
    <TaskListFilters
      :selected-status="selectedStatus"
      :selected-priority="selectedPriority"
      @handle-filter-by-status="(status) => (selectedStatus = status)"
      @handle-filter-by-priority="(priority) => (selectedPriority = priority)"
    ></TaskListFilters>

    <!-- Main Content: Task List -->
    <div class="grow flex flex-col gap-5 w-full">
      <!-- Top Action Bar -->
      <div class="flex justify-between items-center rounded-2xl shadow-md p-4">
        <h2 class="text-xl font-bold text-sky-900 capitalize">
          {{ selectedStatus.replace('_', ' ') }} Tasks -
          {{ selectedPriority.replace('_', ' ') }} Priority
        </h2>
        <Button
          severity="info"
          icon="pi pi-plus"
          label="New Task"
          @click="upsertTaskRef.open()"
          class="rounded-xl px-5 font-bold shadow-sm hover:shadow-md transition-all bg-slate-600 hover:bg-slate-500 text-white border-none"
        />
      </div>

      <!-- Task Groups -->
      <div v-if="groupedTasks.length > 0" class="flex flex-col gap-6 pb-12">
        <div v-for="group in groupedTasks" :key="group.date" class="flex flex-col gap-3">
          <!-- Group Header -->
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-bold text-sky-700">
              {{ group.title }}
            </h3>
            <span class="text-sm font-medium text-sky-500">
              {{ group.done }} / {{ group.total }} Completed
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-cyan-500 transition-all duration-500 ease-out"
              :style="{ width: `${group.progress}%` }"
            ></div>
          </div>

          <!-- Tasks -->
          <TransitionGroup name="list" tag="div" class="flex flex-col gap-6 relative mt-2">
            <div v-for="task in group.tasks" :key="task.id">
              <TaskItem :task="task" />
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Empty State -->
      <TaskListEmptyState v-else :selected-status="selectedStatus"></TaskListEmptyState>
    </div>

    <!-- Create/Edit Task Dialog -->
    <UpsertTask ref="upsertTaskRef" />
  </div>
</template>

<style scoped>
/* List Transitions for modern animations */
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>

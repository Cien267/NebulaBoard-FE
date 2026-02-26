<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { liveQuery } from 'dexie'
import { db } from '../../db/taskDb'
import type { Task, TaskStatusType } from '../../types'
import dayjs from 'dayjs'
import { getPrioritySeverity, getStatusSeverity, formatStatus } from '../../utils'
import TaskListFilters from './TaskListFilters.vue'
import TaskListEmptyState from './TaskListEmptyState.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'

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

const selectedStatus = ref<TaskStatusType>('all')

const showDialog = ref(false)
const editingTaskId = ref<string | null>(null)

// Form State
const form = ref({
  title: '',
  status: 'todo' as Task['status'],
  priority: 'low' as Task['priority'],
  tags: '',
  deadline: null as number | null,
  estimatedTime: null as number | null,
})

function openCreateDialog() {
  editingTaskId.value = null
  form.value = {
    title: '',
    status: 'todo',
    priority: 'medium',
    tags: '',
    deadline: null,
    estimatedTime: null,
  }
  showDialog.value = true
}

function openEditDialog(task: Task) {
  editingTaskId.value = task.id
  form.value = {
    title: task.title,
    status: task.status,
    priority: task.priority,
    tags: task.tags.join(', '),
    deadline: task.deadline || null,
    estimatedTime: task.estimatedTime || null,
  }
  showDialog.value = true
}

async function saveTask() {
  if (!form.value.title.trim()) return

  const taskData: Task = {
    id: editingTaskId.value || crypto.randomUUID(),
    title: form.value.title.trim(),
    status: form.value.status,
    createdDate: editingTaskId.value
      ? tasks.value.find((t) => t.id === editingTaskId.value)?.createdDate || Date.now()
      : Date.now(),
    priority: form.value.priority,
    tags: form.value.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    deadline: form.value.deadline || undefined,
    estimatedTime: form.value.estimatedTime || undefined,
  }

  try {
    await db.tasks.put(taskData)
    showDialog.value = false
  } catch (error) {
    console.error('Failed to save task', error)
  }
}

async function deleteTask(id: string) {
  try {
    await db.tasks.delete(id)
  } catch (error) {
    console.error('Failed to delete task', error)
  }
}

async function toggleTaskStatus(task: Task, checked: boolean) {
  try {
    await db.tasks.update(task.id, {
      status: checked ? 'done' : 'todo',
    })
  } catch (error) {
    console.error('Failed to update status', error)
  }
}

const groupedTasks = computed(() => {
  const groups: Record<string, Task[]> = {}

  tasks.value.forEach((task) => {
    // filter by status
    if (selectedStatus.value !== 'all' && task.status !== selectedStatus.value) {
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
      @handle-filter="(status) => (selectedStatus = status)"
    ></TaskListFilters>

    <!-- Main Content: Task List -->
    <div class="grow flex flex-col gap-5 w-full">
      <!-- Top Action Bar -->
      <div class="flex justify-between items-center rounded-2xl shadow-md p-4">
        <h2 class="text-xl font-bold text-sky-900 capitalize">
          {{ selectedStatus.replace('_', ' ') }} Tasks
        </h2>
        <Button
          icon="pi pi-plus"
          label="New Task"
          @click="openCreateDialog"
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
              class="h-full bg-sky-500 transition-all duration-500 ease-out"
              :style="{ width: `${group.progress}%` }"
            ></div>
          </div>

          <!-- Tasks -->
          <TransitionGroup name="list" tag="ul" class="flex flex-col gap-6 relative mt-2">
            <li
              v-for="task in group.tasks"
              :key="task.id"
              class="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-200 border border-transparent transition-all duration-300 gap-4"
            >
              <div class="flex items-start gap-4 grow overflow-hidden">
                <!-- Checkbox -->
                <div
                  class="pt-1 flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer"
                >
                  <Checkbox
                    :modelValue="task.status === 'done'"
                    @update:modelValue="toggleTaskStatus(task, $event)"
                    :binary="true"
                  />
                </div>

                <div class="flex flex-col gap-1.5 grow min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      class="text-sky-900 text-base font-semibold truncate transition-all duration-300 cursor-pointer"
                      :class="{
                        'line-through text-sky-400 opacity-60': task.status === 'done',
                      }"
                      @click="openEditDialog(task)"
                    >
                      {{ task.title }}
                    </span>
                    <Tag
                      :value="formatStatus(task.status)"
                      :severity="getStatusSeverity(task.status)"
                      class="text-xs"
                    />
                    <Tag
                      :value="task.priority"
                      :severity="getPrioritySeverity(task.priority)"
                      class="text-xs uppercase"
                    />
                  </div>

                  <div class="flex items-center gap-3 text-sm text-sky-500 flex-wrap">
                    <span v-if="task.deadline" class="flex items-center gap-1">
                      <i class="pi pi-calendar text-xs"></i>
                      {{ dayjs(task.deadline).format('MMM D, YYYY') }}
                    </span>
                    <span v-if="task.estimatedTime" class="flex items-center gap-1">
                      <i class="pi pi-clock text-xs"></i>
                      {{ task.estimatedTime }} min
                    </span>
                    <div v-if="task.tags && task.tags.length > 0" class="flex gap-1 items-center">
                      <span
                        v-for="tag in task.tags"
                        :key="tag"
                        class="px-2 py-0.5 bg-sky-100 rounded-md text-xs"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div
                class="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 self-end sm:self-center"
              >
                <Button
                  icon="pi pi-pencil"
                  text
                  rounded
                  severity="secondary"
                  @click="openEditDialog(task)"
                  v-tooltip.top="'Edit'"
                  class="w-8 h-8 p-0"
                />
                <Button
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  @click="deleteTask(task.id)"
                  v-tooltip.top="'Delete'"
                  class="w-8 h-8 p-0 hover:bg-red-100"
                />
              </div>
            </li>
          </TransitionGroup>
        </div>
      </div>

      <!-- Empty State -->
      <TaskListEmptyState
        v-else
        :selected-status="selectedStatus"
        @open-create-dialog="openCreateDialog"
      ></TaskListEmptyState>
    </div>

    <!-- Create/Edit Task Dialog -->
    <Dialog
      v-model:visible="showDialog"
      :header="editingTaskId ? 'Edit Task' : 'Create Task'"
      modal
      :style="{ width: '90vw', maxWidth: '500px' }"
      class="p-fluid"
    >
      <div class="flex flex-col gap-4 mt-2">
        <!-- Title -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-sky-700">Title</label>
          <InputText
            v-model="form.title"
            placeholder="What needs to be done?"
            autofocus
            class="rounded-lg"
          />
        </div>

        <!-- Status & Priority -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sky-700">Status</label>
            <select
              v-model="form.status"
              class="p-inputtext p-component rounded-lg appearance-none"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sky-700">Priority</label>
            <select
              v-model="form.priority"
              class="p-inputtext p-component rounded-lg appearance-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-sky-700"
            >Tags <span class="text-xs text-sky-400 font-normal">(comma separated)</span></label
          >
          <InputText
            v-model="form.tags"
            placeholder="e.g. feature, bug, design"
            class="rounded-lg"
          />
        </div>

        <!-- Deadline & Estimated Time -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sky-700">Deadline</label>
            <input
              type="date"
              class="p-inputtext p-component rounded-lg"
              :value="form.deadline ? dayjs(form.deadline).format('YYYY-MM-DD') : ''"
              @input="
                (e) =>
                  (form.deadline = (e.target as HTMLInputElement).value
                    ? dayjs((e.target as HTMLInputElement).value).valueOf()
                    : null)
              "
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sky-700">Est. Time (mins)</label>
            <input
              type="number"
              v-model.number="form.estimatedTime"
              placeholder="e.g. 60"
              class="p-inputtext p-component rounded-lg"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            text
            @click="showDialog = false"
            class="rounded-xl px-4"
          />
          <Button
            label="Save Task"
            icon="pi pi-check"
            @click="saveTask"
            :disabled="!form.title.trim()"
            class="rounded-xl px-6"
          />
        </div>
      </template>
    </Dialog>
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

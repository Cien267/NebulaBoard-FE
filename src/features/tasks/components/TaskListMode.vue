<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'

interface Task {
  id: string
  title: string
  completed: boolean
}

const tasks = ref<Task[]>([
  { id: '1', title: 'Design the new database schema', completed: false },
  { id: '2', title: 'Implement login page', completed: true },
])
const newTaskTitle = ref('')
const editingTaskId = ref<string | null>(null)
const editTaskTitle = ref('')

function addTask() {
  if (newTaskTitle.value.trim()) {
    tasks.value.unshift({
      id: crypto.randomUUID(),
      title: newTaskTitle.value.trim(),
      completed: false,
    })
    newTaskTitle.value = ''
  }
}

function deleteTask(id: string) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

function startEdit(task: Task) {
  editingTaskId.value = task.id
  editTaskTitle.value = task.title
}

function saveEdit(task: Task) {
  if (editTaskTitle.value.trim()) {
    task.title = editTaskTitle.value.trim()
  }
  editingTaskId.value = null
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Add Task Form -->
    <form @submit.prevent="addTask" class="flex gap-3">
      <InputText v-model="newTaskTitle" placeholder="What needs to be done?" class="grow" />
      <Button
        type="submit"
        icon="pi pi-plus"
        label="Add Task"
        class="rounded-2xl px-6 font-semibold shadow-sm hover:shadow-md transition-shadow"
        :disabled="!newTaskTitle.trim()"
      />
    </form>

    <!-- Task List -->
    <div class="mt-2">
      <TransitionGroup name="list" tag="ul" class="flex flex-col gap-6 relative">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="group flex items-center justify-between p-4 bg-surface-0 dark:bg-surface-800 rounded-2xl shadow-md transition-all duration-300"
        >
          <div class="flex items-center gap-4 flex-grow overflow-hidden">
            <!-- Enhanced Checkbox -->
            <div
              class="flex items-center justify-center transform hover:scale-110 transition-transform"
            >
              <Checkbox v-model="task.completed" :binary="true" inputId="task-check" />
            </div>

            <!-- Edit Mode -->
            <div
              v-if="editingTaskId === task.id"
              class="grow flex items-center gap-2 w-full max-w-full transform transition-all"
            >
              <InputText
                v-model="editTaskTitle"
                class="grow"
                @keyup.enter="saveEdit(task)"
                @keyup.escape="editingTaskId = null"
                autofocus
              />
              <Button
                icon="pi pi-check"
                text
                rounded
                severity="success"
                @click="saveEdit(task)"
                size="small"
                class="hover:bg-green-100 dark:hover:bg-green-900/40"
              />
              <Button
                icon="pi pi-times"
                text
                rounded
                severity="secondary"
                @click="editingTaskId = null"
                size="small"
                class="hover:bg-surface-100 dark:hover:bg-surface-800"
              />
            </div>

            <!-- View Mode -->
            <span
              v-else
              class="text-surface-900 dark:text-surface-0 text-base font-medium transition-all duration-300 truncate select-none cursor-pointer"
              :class="{
                'line-through text-surface-400 dark:text-surface-500 opacity-60': task.completed,
              }"
              @dblclick="startEdit(task)"
            >
              {{ task.title }}
            </span>
          </div>

          <!-- Actions (Visible on Hover) -->
          <div
            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4"
            v-if="editingTaskId !== task.id"
          >
            <Button
              icon="pi pi-pencil"
              text
              rounded
              severity="secondary"
              @click="startEdit(task)"
              aria-label="Edit"
              v-tooltip.top="'Edit Task'"
              class="w-8 h-8 p-0"
            />
            <Button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="deleteTask(task.id)"
              aria-label="Delete"
              v-tooltip.top="'Delete Task'"
              class="w-8 h-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/40"
            />
          </div>
        </li>
      </TransitionGroup>

      <!-- Empty State -->
      <div
        v-if="tasks.length === 0"
        class="flex flex-col items-center justify-center py-16 text-surface-500 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-dashed border-surface-300 dark:border-surface-700"
      >
        <div class="bg-surface-200 dark:bg-surface-700 rounded-full p-4 mb-4">
          <i class="pi pi-check-circle text-4xl text-surface-400"></i>
        </div>
        <p class="text-lg font-medium text-surface-600 dark:text-surface-300">All caught up!</p>
        <p class="text-sm mt-1">Add a new task to get started.</p>
      </div>
    </div>
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
  transform: translateY(-20px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

/* Ensure smooth layout changes */
.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>

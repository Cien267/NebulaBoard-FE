<script setup lang="ts">
import { ref, computed } from 'vue'
import { getPriorityClasses, getStatusClasses } from '../../utils'
import { db } from '../../db/taskDb'
import type { Task } from '../../types'
import dayjs from 'dayjs'
import UpsertTask from './UpsertTask.vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

const { task } = defineProps(['task'])
const upsertTaskRef = ref()
const isDisabledTaskAction = computed(() => {
  const createdDate = dayjs(task.createdDate)
  return createdDate.isBefore(dayjs().startOf('day'))
})

async function toggleTaskStatus(task: Task, checked: boolean) {
  if (isDisabledTaskAction.value) return
  try {
    await db.tasks.update(task.id, {
      status: checked ? 'done' : 'todo',
    })
  } catch (error) {
    console.error('Failed to update status', error)
  }
}

async function deleteTask(id: string) {
  try {
    await db.tasks.delete(id)
  } catch (error) {
    console.error('Failed to delete task', error)
  }
}
</script>

<template>
  <div
    :key="task.id"
    class="group relative flex flex-col gap-4 p-4 rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300 overflow-hidden"
    :class="{ 'bg-slate-100! opacity-60': task.status === 'done' }"
  >
    <div class="flex items-start gap-4 relative z-10">
      <!-- checkbox -->
      <div class="pt-1">
        <Checkbox
          :modelValue="task.status === 'done'"
          @update:modelValue="toggleTaskStatus(task, $event)"
          :binary="true"
          :disabled="isDisabledTaskAction"
          class="scale-110"
        />
      </div>

      <!-- content -->
      <div
        class="flex flex-col gap-2 grow min-w-0 cursor-pointer"
        @click="!isDisabledTaskAction ? upsertTaskRef.open(task) : () => {}"
      >
        <!-- title + status -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- status dot -->
          <span class="w-2.5 h-2.5 rounded-full" :class="getStatusClasses(task.status)" />

          <!-- title -->
          <span
            class="font-semibold text-slate-800 truncate cursor-pointer transition"
            :class="{
              'line-through text-slate-400': task.status === 'done',
            }"
          >
            {{ task.title }}
          </span>

          <!-- priority badge -->
          <span
            class="text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wide"
            :class="getPriorityClasses(task.priority)"
          >
            {{ task.priority }}
          </span>
        </div>

        <!-- metadata -->
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span v-if="task.deadline" class="flex items-center gap-1">
            <i class="pi pi-calendar text-[11px]" />
            {{ dayjs(task.deadline).format('MMM D • HH:mm') }}
          </span>

          <span v-if="task.estimatedTime" class="flex items-center gap-1">
            <i class="pi pi-clock text-[11px]" />
            {{ task.estimatedTime }}m
          </span>

          <!-- tags -->
          <div v-if="task.tags?.length" class="flex gap-1 flex-wrap">
            <span
              v-for="tag in task.tags"
              :key="tag"
              class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- actions -->
      <div
        v-if="!isDisabledTaskAction"
        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
      >
        <Button
          icon="pi pi-pencil"
          text
          rounded
          severity="secondary"
          class="w-8 h-8"
          @click="upsertTaskRef.open(task)"
        />
        <Button
          icon="pi pi-trash"
          text
          rounded
          severity="danger"
          class="w-8 h-8"
          @click="deleteTask(task.id)"
        />
      </div>
    </div>
  </div>
  <UpsertTask ref="upsertTaskRef" />
</template>

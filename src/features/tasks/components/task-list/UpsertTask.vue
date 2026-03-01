<script setup lang="ts">
import type { Task } from '../../types'
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '../../constants'
import DatePicker from 'primevue/datepicker'
import { db } from '../../db/taskDb'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const task = ref<Task | undefined>(undefined)
const showDialog = ref(false)
const form = ref()

const open = (taskData?: Task) => {
  task.value = taskData
  form.value = {
    title: taskData?.title ?? '',
    status: taskData?.status ?? 'todo',
    priority: taskData?.priority ?? 'low',
    tags: taskData?.tags?.join(',') ?? '',
    deadline: taskData?.deadline ?? new Date(new Date().setHours(23, 59, 59, 999)),
    estimatedTime: taskData?.estimatedTime ?? null,
  }

  showDialog.value = true
}

defineExpose({ open })

async function saveTask() {
  if (!form.value.title.trim()) return

  const taskData: Task = {
    id: task.value?.id || crypto.randomUUID(),
    title: form.value.title.trim(),
    status: form.value.status,
    createdDate: task.value?.createdDate ?? Date.now(),
    priority: form.value.priority,
    tags: form.value.tags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean),
    deadline: form.value.deadline || new Date(new Date().setHours(23, 59, 59, 999)),
    estimatedTime: form.value.estimatedTime || undefined,
  }

  try {
    await db.tasks.put(taskData)
    showDialog.value = false
  } catch (error) {
    console.error('Failed to save task', error)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="showDialog"
    :header="task?.id ? 'Edit Task' : 'Create Task'"
    modal
    :style="{ width: '90vw', maxWidth: '500px' }"
    class="p-fluid"
  >
    <div class="flex flex-col gap-4 mt-2">
      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Title <span class="text-red-500">*</span></label>
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
          <label class="font-medium text-slate-700">Status</label>
          <Select
            v-model="form.status"
            :options="TASK_STATUS_OPTIONS"
            optionLabel="label"
            option-value="value"
            placeholder="Select a status"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Priority</label>
          <Select
            v-model="form.priority"
            :options="TASK_PRIORITY_OPTIONS"
            optionLabel="label"
            option-value="value"
            placeholder="Select a priority"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700"
          >Tags <span class="text-sm text-slate-500 font-normal">(comma separated)</span></label
        >
        <InputText v-model="form.tags" placeholder="e.g. feature, bug, design" class="rounded-lg" />
      </div>

      <!-- Deadline & Estimated Time -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Deadline</label>
          <DatePicker id="datepicker-24h" v-model="form.deadline" showTime hourFormat="24" fluid />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Est. Time (mins)</label>
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
          severity="info"
          label="Save"
          icon="pi pi-check"
          @click="saveTask"
          :disabled="!form.title.trim()"
          class="rounded-xl px-6"
        />
      </div>
    </template>
  </Dialog>
</template>

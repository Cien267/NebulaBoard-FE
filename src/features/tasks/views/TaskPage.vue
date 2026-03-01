<script setup lang="ts">
import { ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SelectButton from 'primevue/selectbutton'
import TaskListMode from '../components/task-list/TaskListMode.vue'
import TaskRichTextMode from '../components/TaskRichTextMode.vue'
import type { SelectButtonPassThroughMethodOptions } from 'primevue/selectbutton'

const modes = ref([
  {
    value: 'list',
    label: 'List',
    icon: 'pi pi-list',
  },
  {
    value: 'rich-text',
    label: 'Rich Text',
    icon: 'pi pi-book',
  },
])
const selectedMode = ref({
  value: 'list',
  label: 'List',
  icon: 'pi pi-list',
})
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <!-- Header Section -->
      <div class="flex items-center justify-center mb-10 gap-6">
        <!-- Mode Switcher -->
        <div class="animate-fade-in-up delay-100 p-1">
          <SelectButton
            v-model="selectedMode"
            :options="modes"
            optionLabel="value"
            dataKey="value"
            aria-labelledby="custom"
            :pt="{
              root: { class: 'bg-slate-100 p-1 rounded-xl flex gap-1 border-none' },
              button: ({ context }: SelectButtonPassThroughMethodOptions) => ({
                class: [
                  'border-none transition-all duration-200 rounded-lg flex-1',
                  context.active
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'bg-transparent text-slate-500 hover:bg-slate-200/50',
                ],
              }),
            }"
          >
            <template #option="slotProps">
              <div class="flex items-center justify-center gap-2 py-1 px-4 w-full">
                <i :class="[slotProps.option.icon, 'text-base']"></i>
                <span class="text-sm font-semibold whitespace-nowrap">
                  {{ slotProps.option.label }}
                </span>
              </div>
            </template>
          </SelectButton>
        </div>
      </div>

      <!-- Content Area -->
      <div class="relative w-full h-full animate-fade-in-up delay-200">
        <Transition name="fade-slide" mode="out-in">
          <TaskListMode v-if="selectedMode.value === 'list'" />
          <TaskRichTextMode v-else class="w-full" />
        </Transition>
      </div>
    </div>
  </DefaultLayout>
</template>

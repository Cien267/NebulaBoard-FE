<script setup lang="ts">
import { ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SelectButton from 'primevue/selectbutton'
import TaskListMode from '../components/TaskListMode.vue'
import TaskRichTextMode from '../components/TaskRichTextMode.vue'

const modes = ref(['List', 'Rich Text'])
const selectedMode = ref('List')
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
            aria-labelledby="basic"
            :allowEmpty="false"
            class="mode-switcher"
          />
        </div>
      </div>

      <!-- Content Area -->
      <div class="relative w-full h-full animate-fade-in-up delay-200">
        <Transition name="fade-slide" mode="out-in">
          <TaskListMode v-if="selectedMode === 'List'" class="w-full max-w-3xl mx-auto" />
          <TaskRichTextMode v-else class="w-full" />
        </Transition>
      </div>
    </div>
  </DefaultLayout>
</template>

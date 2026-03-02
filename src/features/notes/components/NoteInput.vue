<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'add', note: { title: string; content: string; color: string; tags: string[], isPinned: boolean }): void
}>()

const isExpanded = ref(false)
const title = ref('')
const content = ref('')
const color = ref('bg-white')
const inputContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const colors = [
  { name: 'Default', class: 'bg-white' },
  { name: 'Red', class: 'bg-red-100' },
  { name: 'Orange', class: 'bg-orange-100' },
  { name: 'Yellow', class: 'bg-yellow-100' },
  { name: 'Green', class: 'bg-green-100' },
  { name: 'Teal', class: 'bg-teal-100' },
  { name: 'Blue', class: 'bg-blue-100' },
  { name: 'Purple', class: 'bg-purple-100' },
  { name: 'Pink', class: 'bg-pink-100' },
]

const expand = () => {
  if (!isExpanded.value) {
    isExpanded.value = true
    setTimeout(() => {
        textareaRef.value?.focus()
    }, 50)
  }
}

const collapse = () => {
  isExpanded.value = false
}

const saveAndCollapse = () => {
  if (title.value.trim() || content.value.trim()) {
    emit('add', {
      title: title.value.trim(),
      content: content.value.trim(),
      color: color.value,
      tags: [],
      isPinned: false
    })
    // Reset
    title.value = ''
    content.value = ''
    color.value = 'bg-white'
  }
  collapse()
}

// Click outside detection
const handleClickOutside = (event: MouseEvent) => {
  if (inputContainer.value && !inputContainer.value.contains(event.target as Node)) {
    saveAndCollapse()
  }
}

// Adjust textarea height automatically
const adjustHeight = (event: Event) => {
   const target = event.target as HTMLTextAreaElement
   target.style.height = 'auto'
   target.style.height = target.scrollHeight + 'px'
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="flex justify-center w-full my-8">
    <div
      ref="inputContainer"
      :class="[
        'relative w-full max-w-2xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700',
        color,
      ]"
    >
      <div v-if="!isExpanded" class="flex items-center p-3 cursor-text" @click="expand">
        <input
          type="text"
          placeholder="Take a note..."
          class="w-full bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 px-2 font-medium"
          readonly tabindex="-1"
        />
        <div class="flex gap-2 text-slate-400">
           <i class="pi pi-check-square p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full cursor-pointer transition-colors"></i>
           <i class="pi pi-image p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full cursor-pointer transition-colors"></i>
        </div>
      </div>

      <div v-else class="flex flex-col p-4">
        <input
          v-model="title"
          type="text"
          placeholder="Title"
          class="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 font-semibold text-lg mb-2"
        />
        <textarea
          ref="textareaRef"
          v-model="content"
          placeholder="Take a note..."
          class="w-full bg-transparent border-none outline-none text-slate-700 dark:text-slate-300 resize-none overflow-hidden min-h-[40px]"
          @input="adjustHeight"
          rows="1"
        ></textarea>
        
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center gap-1">
             <!-- Color Picker Dropdown Simulator -->
             <div class="relative group inline-block">
                <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center w-9 h-9">
                   <i class="pi pi-palette"></i>
                </button>
                <div class="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-white dark:bg-slate-800 shadow-xl rounded-lg p-2 border border-slate-200 dark:border-slate-700 z-10 gap-1 w-max">
                   <button 
                      v-for="c in colors" 
                      :key="c.name"
                      @click="color = c.class"
                      :class="['w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 hover:ring-2 hover:ring-slate-400 transition-all', c.class]"
                      :title="c.name"
                   ></button>
                </div>
             </div>
          </div>
          <button
            @click.stop="saveAndCollapse"
            class="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-black/5 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles mainly handled by tailwind */
</style>

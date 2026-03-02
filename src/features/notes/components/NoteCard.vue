<script setup lang="ts">
import { ref } from 'vue'
import type { Note } from '../types'

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  (e: 'update', id: string, updates: Partial<Note>): void
  (e: 'delete', id: string): void
  (e: 'toggle-pin', id: string): void
}>()

const isHovered = ref(false)
const isEditing = ref(false)

const editTitle = ref(props.note.title)
const editContent = ref(props.note.content)

const handleSave = () => {
    isEditing.value = false
    if (editTitle.value !== props.note.title || editContent.value !== props.note.content) {
        emit('update', props.note.id, {
            title: editTitle.value,
            content: editContent.value
        })
    }
}

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

const changeColor = (colorClass: string) => {
    emit('update', props.note.id, { color: colorClass })
}
</script>

<template>
  <div
    class="relative group rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 break-inside-avoid mb-4 shadow-sm hover:shadow-md cursor-pointer"
    :class="[note.color || 'bg-white']"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Pin Button -->
    <button
      @click.stop="emit('toggle-pin', note.id)"
      class="absolute top-2 right-2 p-2 rounded-full transition-opacity z-10"
      :class="[
         isHovered || note.isPinned ? 'opacity-100' : 'opacity-0',
         note.isPinned ? 'text-black dark:text-white' : 'text-slate-400 hover:bg-black/5 hover:text-slate-700'
      ]"
      title="Pin note"
    >
      <i class="pi" :class="note.isPinned ? 'pi-bookmark-fill' : 'pi-bookmark'"></i>
    </button>

    <!-- Note Content (Read View) -->
    <div v-if="!isEditing" class="p-4" @click="isEditing = true">
      <h3 v-if="note.title" class="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 pr-8 whitespace-pre-wrap">{{ note.title }}</h3>
      <p class="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words text-sm">{{ note.content }}</p>
    </div>

    <!-- Note Content (Edit View) -->
    <div v-else class="p-4 flex flex-col gap-2">
       <input
          v-model="editTitle"
          type="text"
          placeholder="Title"
          class="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 font-bold text-lg"
        />
        <textarea
          v-model="editContent"
          placeholder="Take a note..."
          class="w-full bg-transparent border-none outline-none text-slate-700 dark:text-slate-300 resize-none overflow-hidden min-h-[60px]"
          rows="3"
        ></textarea>
        <div class="flex justify-end mt-2">
           <button @click.stop="handleSave" class="px-4 py-1.5 bg-black/5 hover:bg-black/10 text-slate-800 rounded-lg text-sm font-medium transition-colors">Done</button>
        </div>
    </div>

    <!-- Toolbar Options (Visible on hover) -->
    <div
      class="flex items-center gap-1 px-4 py-2 transition-opacity duration-200"
      :class="{ 'opacity-100': isHovered && !isEditing, 'opacity-0 pointer-events-none': !isHovered || isEditing }"
    >
        <!-- Color Picker -->
        <div class="relative group/picker inline-block">
            <button class="p-1.5 text-slate-500 hover:bg-black/10 rounded-full transition-colors w-8 h-8 flex items-center justify-center">
                <i class="pi pi-palette text-sm"></i>
            </button>
            <div class="absolute bottom-full left-0 mb-2 hidden group-hover/picker:flex bg-white dark:bg-slate-800 shadow-xl rounded-lg p-2 border border-slate-200 dark:border-slate-700 z-20 gap-1 w-max">
                <button 
                  v-for="c in colors" 
                  :key="c.name"
                  @click.stop="changeColor(c.class)"
                  :class="['w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 hover:ring-2 hover:ring-slate-400 transition-all', c.class]"
                  :title="c.name"
                ></button>
            </div>
        </div>
        
        <!-- Delete -->
        <button 
          @click.stop="emit('delete', note.id)"
          class="p-1.5 text-slate-500 hover:bg-black/10 rounded-full transition-colors w-8 h-8 flex items-center justify-center ml-auto group-hover/btn:text-red-500" 
          title="Delete note"
        >
            <i class="pi pi-trash text-sm"></i>
        </button>
    </div>
  </div>
</template>

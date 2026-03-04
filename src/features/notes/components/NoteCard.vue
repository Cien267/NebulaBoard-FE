<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Note } from '../types'
import { NOTE_COLORS } from '../constants'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

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
const textareaRef = ref<any>(null)
const noteCardContainer = ref<HTMLElement | null>(null)
const editTitle = ref(props.note.title)
const editContent = ref(props.note.content)

const adjustHeight = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = target.scrollHeight + 'px'
}

const handleStartEditing = () => {
  isEditing.value = true
  setTimeout(() => {
    const target = textareaRef.value?.$el || textareaRef.value
    if (target && target.style) {
      target.style.height = 'auto'
      target.style.height = target.scrollHeight + 'px'
    }
  }, 0)
}

const handleSave = () => {
  isEditing.value = false
  isHovered.value = false
  if (editTitle.value !== props.note.title || editContent.value !== props.note.content) {
    emit('update', props.note.id, {
      title: editTitle.value,
      content: editContent.value,
    })
  }
}

const changeColor = (colorClass: string) => {
  emit('update', props.note.id, { color: colorClass })
}

const handleClickOutside = (event: MouseEvent) => {
  if (noteCardContainer.value && !noteCardContainer.value.contains(event.target as Node)) {
    handleSave()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div
    class="relative group rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 break-inside-avoid mb-4 shadow-sm hover:shadow-md cursor-pointer"
    :class="[note.color || 'bg-white']"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    ref="noteCardContainer"
  >
    <!-- Pin Button -->
    <Button
      :icon="note.isPinned ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
      text
      rounded
      :severity="note.isPinned ? 'warn' : 'secondary'"
      class="w-8 h-8 absolute! top-2 right-2"
      :class="[
        isHovered || note.isPinned ? 'opacity-100' : 'opacity-0',
        note.isPinned ? 'text-black ' : 'text-slate-400 hover:bg-black/5 hover:text-slate-700',
      ]"
      @click.stop="emit('toggle-pin', note.id)"
    />

    <!-- Note Content (Read View) -->
    <div v-if="!isEditing" class="p-4" @click="handleStartEditing">
      <h3 v-if="note.title" class="font-bold text-lg text-slate-800 mb-2 pr-8 whitespace-pre-wrap">
        {{ note.title }}
      </h3>
      <p class="text-slate-700 whitespace-pre-wrap wrap-break-word text-sm">
        {{ note.content }}
      </p>
    </div>

    <!-- Note Content (Edit View) -->
    <div v-else class="p-4 flex flex-col gap-2">
      <InputText
        v-model="editTitle"
        type="text"
        placeholder="Title"
        class="border-l-0! border-t-0! border-r-0! rounded-none!"
        :class="note.color"
      />
      <Textarea
        ref="textareaRef"
        v-model="editContent"
        placeholder="Take a note..."
        class="border-l-0! border-t-0! border-r-0! rounded-none!"
        :class="note.color"
        @input="adjustHeight"
      ></Textarea>
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center gap-1">
          <!-- Color Picker Dropdown Simulator -->
          <div class="flex flex-wrap z-10 gap-1">
            <span
              v-for="c in NOTE_COLORS"
              :key="c.name"
              @click.stop="changeColor(c.class)"
              :class="[
                'cursor-pointer w-6 h-6 rounded-full border border-slate-300  hover:scale-105 hover:border-cyan-600! transition-all',
                c.class === note.color ? 'scale-105 border-cyan-600!' : '',
                c.class,
              ]"
              :title="c.name"
            ></span>
          </div>
        </div>
      </div>
      <!-- <Button severity="info" @click.stop="handleSave" label="Save" class="mt-2 w-20 ml-auto">
      </Button> -->
    </div>

    <!-- Toolbar Options (Visible on hover) -->
    <div
      class="flex items-center gap-1 px-4 py-2 transition-opacity duration-200"
      :class="{
        'opacity-100': isHovered && !isEditing,
        'opacity-0 pointer-events-none': !isHovered || isEditing,
        'h-0': isEditing,
      }"
    >
      <!-- Delete -->
      <Button
        icon="pi pi-trash"
        text
        rounded
        severity="danger"
        class="w-8 h-8 ml-auto"
        @click.stop="emit('delete', note.id)"
      />
    </div>
  </div>
</template>

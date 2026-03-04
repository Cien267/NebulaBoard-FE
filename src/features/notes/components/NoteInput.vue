<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { NOTE_COLORS } from '../constants'

const emit = defineEmits<{
  (
    e: 'add',
    note: { title: string; content: string; color: string; tags: string[]; isPinned: boolean },
  ): void
}>()

const isExpanded = ref(false)
const title = ref('')
const content = ref('')
const color = ref('bg-white')
const inputContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

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
      isPinned: false,
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
        'relative w-full max-w-2xl transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg rounded-xl overflow-hidden ',
        color,
      ]"
    >
      <InputText
        v-if="!isExpanded"
        @click="expand"
        type="text"
        placeholder="Take a note..."
        class="w-full border-none!"
        readonly
        tabindex="-1"
      />
      <div v-else class="flex flex-col p-4 gap-6">
        <InputText
          v-model="title"
          placeholder="Title"
          class="border-l-0! border-t-0! border-r-0! rounded-none!"
          :class="color"
          autofocus
        />
        <Textarea
          ref="textareaRef"
          v-model="content"
          placeholder="Take a note..."
          class="border-l-0! border-t-0! border-r-0! rounded-none!"
          :class="color"
          @input="adjustHeight"
          rows="1"
        ></Textarea>

        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center gap-1">
            <!-- Color Picker Dropdown Simulator -->
            <div class="flex p-2 z-10 gap-2 w-max">
              <span
                v-for="c in NOTE_COLORS"
                :key="c.name"
                @click="color = c.class"
                :class="[
                  'cursor-pointer w-8 h-8 rounded-full border border-slate-300  hover:scale-105 hover:border-cyan-600! transition-all',
                  c.class,
                ]"
                :title="c.name"
              ></span>
            </div>
          </div>
          <Button @click.stop="saveAndCollapse" text icon="pi pi-times" label="Close" />
        </div>
      </div>
    </div>
  </div>
</template>

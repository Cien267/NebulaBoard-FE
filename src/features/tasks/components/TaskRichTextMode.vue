<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Editor from 'primevue/editor'
import { db } from '../db/taskDb'
import { debounce } from 'lodash-es'

const noteId = 'nebula-board-rich-text-task'
const content = ref('')
const isSaving = ref(false)

onMounted(async () => {
  const savedNote = await db.notes.get(noteId)
  if (savedNote) {
    content.value = savedNote.content
  }
})

const saveToDb = debounce(async (newContent: string) => {
  isSaving.value = true
  try {
    await db.notes.put({
      id: noteId,
      title: 'Rich Text Task',
      content: newContent,
      updatedDate: Date.now(),
    })
  } finally {
    setTimeout(() => {
      isSaving.value = false
    }, 500)
  }
}, 1000)

watch(content, (newValue) => {
  saveToDb(newValue)
})
</script>

<template>
  <div
    class="relative h-full min-h-200 flex flex-col bg-surface-0 rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300"
  >
    <div class="absolute top-2 right-4 z-10 text-xs font-medium">
      <span v-if="isSaving" class="text-primary-500 animate-pulse flex items-center gap-1">
        <i class="pi pi-sync animate-spin text-[10px]"></i> Saving...
      </span>
      <span v-else class="text-slate-400">Saved to local</span>
    </div>

    <Editor v-model="content" editorStyle="height: 800px; border: none;" class="grow w-full pt-4" />
  </div>
</template>

<style>
.p-editor-container {
  border: none !important;
}
.p-editor-toolbar {
  border: none !important;
  border-bottom: 1px solid var(--surface-200) !important;
  background: transparent !important;
}
</style>

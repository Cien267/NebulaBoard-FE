<script setup lang="ts">
import type { Note } from '../types'
import NoteCard from './NoteCard.vue'

defineProps<{
  notes: Note[]
}>()

const emit = defineEmits<{
  (e: 'update', id: string, updates: Partial<Note>): void
  (e: 'delete', id: string): void
  (e: 'toggle-pin', id: string): void
}>()
</script>

<template>
  <!-- Tailwind CSS Columns for Masonry -->
  <div class="w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @update="(id, updates) => emit('update', id, updates)"
        @delete="(id) => emit('delete', id)"
        @toggle-pin="(id) => emit('toggle-pin', id)"
      />
  </div>
</template>

<style scoped>
/* Ensure space-y doesn't mess with columns */
.columns-1 > * { margin-bottom: 1rem; }
.columns-2 > * { margin-bottom: 1rem; }
.columns-3 > * { margin-bottom: 1rem; }
.columns-4 > * { margin-bottom: 1rem; }
</style>

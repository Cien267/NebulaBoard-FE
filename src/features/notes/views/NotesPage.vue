<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import NoteInput from '../components/NoteInput.vue'
import NotesMasonry from '../components/NotesMasonry.vue'
import { notesService } from '../services/notesService'
import type { Note } from '../types'

const notes = ref<Note[]>([])
const loading = ref(true)

const fetchNotes = async () => {
  loading.value = true
  try {
    notes.value = await notesService.getAllNotes()
  } catch (err) {
    console.error('Failed to fetch notes:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNotes()
})

const handleAddNote = async (noteData: Omit<Note, 'id' | 'createdDate' | 'updatedDate'>) => {
  try {
    await notesService.addNote(noteData)
    await fetchNotes()
  } catch (err) {
    console.error('Failed to add note:', err)
  }
}

const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
  try {
    await notesService.updateNote(id, updates)
    await fetchNotes()
  } catch (err) {
    console.error('Failed to update note:', err)
  }
}

const handleDeleteNote = async (id: string) => {
  // simple confirm
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await notesService.deleteNote(id)
      await fetchNotes()
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }
}

const handleTogglePin = async (id: string) => {
  const note = notes.value.find(n => n.id === id)
  if (note) {
    try {
      await notesService.togglePin(id, note.isPinned)
      await fetchNotes()
    } catch (err) {
      console.error('Failed to toggle pin:', err)
    }
  }
}

const pinnedNotes = computed(() => notes.value.filter(n => n.isPinned))
const otherNotes = computed(() => notes.value.filter(n => !n.isPinned))
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      <!-- Create Note Section -->
      <NoteInput @add="handleAddNote" />

      <!-- Pinned Notes Section -->
      <div v-if="pinnedNotes.length > 0" class="mb-10 animate-fade-in-up">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Pinned</h2>
        <NotesMasonry 
            :notes="pinnedNotes"
            @update="handleUpdateNote"
            @delete="handleDeleteNote"
            @toggle-pin="handleTogglePin"
        />
      </div>

      <!-- Other Notes Section -->
      <div v-if="otherNotes.length > 0" class="animate-fade-in-up delay-100">
        <h2 v-if="pinnedNotes.length > 0" class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Others</h2>
        <NotesMasonry 
            :notes="otherNotes"
            @update="handleUpdateNote"
            @delete="handleDeleteNote"
            @toggle-pin="handleTogglePin"
        />
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && notes.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400">
           <i class="pi pi-book text-6xl mb-4 opacity-50"></i>
           <p class="text-lg font-medium">Notes you add appear here</p>
      </div>

    </div>
  </DefaultLayout>
</template>

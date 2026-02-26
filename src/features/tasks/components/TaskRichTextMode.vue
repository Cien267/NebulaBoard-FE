<script setup lang="ts">
import { ref } from 'vue'
import Editor from 'primevue/editor'

const content = ref(`<h2>Project Phase 1 Goals</h2>
<ul>
  <li>Research competitor features</li>
  <li>Setup project infrastructure</li>
  <li>Design initial wireframes</li>
</ul>
<p><br></p>
<p>Ensure to review the design guidelines before starting development.</p>`)
</script>

<template>
  <div
    class="h-full min-h-[500px] flex flex-col bg-surface-0 rounded-2xl shadow-lg overflow-hidden hover:border-primary-400 transition-colors duration-300"
  >
    <Editor
      v-model="content"
      editorStyle="height: 500px; font-size: 1rem; line-height: 1.6; padding: 1.5rem;"
      class="grow w-full border-none"
    />
  </div>
</template>

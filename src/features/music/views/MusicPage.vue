<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      <!-- Main Content Area -->
      <div class="z-10 flex-1 flex flex-col h-full pointer-events-none">
        <!-- Player Hidden Components -->
        <LocalAudioPlayer />
        <YoutubePlayer />

        <!-- Minimalistic center display when music is playing -->
        <div class="flex-1 flex items-center justify-center p-8">
          <div
            v-if="currentTrack"
            class="flex flex-col items-center gap-6 mt-20 animate-fade-in pointer-events-auto"
          >
            <div
              class="text-center bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500 group"
            >
              <h1
                class="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-2xl font-serif"
              >
                {{ currentTrack.title }}
              </h1>
              <p
                class="text-lg text-white/70 font-medium tracking-[0.2em] uppercase origin-center group-hover:text-cyan-400 transition-colors"
              >
                {{ currentTrack.artist }}
              </p>
            </div>
          </div>
        </div>

        <MusicPlayerController />
      </div>

      <!-- Sidebar Menu Layer -->
      <MusicSidebar class="z-30 pointer-events-auto" />

      <!-- Top-level Navigation trigger, allowing user to navigate back to dashboard -->
      <div class="absolute top-8 left-8 z-50 pointer-events-auto">
        <button
          @click="$router.push('/dashboard')"
          class="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
        >
          <i class="pi pi-arrow-left"></i>
        </button>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMusicStore } from '../store/useMusicStore'
import { storeToRefs } from 'pinia'
import LocalAudioPlayer from '../components/LocalAudioPlayer.vue'
import YoutubePlayer from '../components/YoutubePlayer.vue'
import MusicPlayerController from '../components/MusicPlayerController.vue'
import MusicSidebar from '../components/MusicSidebar.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const store = useMusicStore()
const { currentTrack } = storeToRefs(store)

onMounted(() => {
  if (store.tracks.length === 0) {
    store.loadInitialData()
  }
})
</script>

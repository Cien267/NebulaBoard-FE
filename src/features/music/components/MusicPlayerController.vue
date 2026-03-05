<template>
  <div class="z-50 px-6 py-4 flex flex-col items-center justify-center pointer-events-none">
    <div
      class="w-full max-w-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto transition-transform hover:-translate-y-1"
    >
      <!-- Progress Bar -->
      <div
        class="w-full h-1.5 bg-white/10 rounded-full cursor-pointer relative group"
        @click="handleSeek"
      >
        <div
          class="absolute top-0 left-0 h-full bg-cyan-400 rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          :style="{ width: `${progress}%` }"
        ></div>
        <!-- Hover seeker head -->
        <div
          class="absolute top-1/2 -ml-2 -mt-2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          :style="{ left: `${progress}%` }"
        ></div>
      </div>

      <div class="flex items-center justify-between w-full">
        <!-- Track Info -->
        <div class="flex items-center gap-4 w-1/3">
          <div
            class="w-12 h-12 rounded-xl bg-white/10 border border-white/5 overflow-hidden flex-shrink-0 animate-pulse-slow"
          >
            <img
              v-if="currentTrack?.thumbnail"
              :src="currentTrack.thumbnail"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-slate-800 flex items-center justify-center">
              <i class="pi pi-music text-slate-400"></i>
            </div>
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-white font-medium truncate text-sm">{{
              currentTrack?.title || 'No track selected'
            }}</span>
            <span class="text-white/60 text-xs truncate">{{
              currentTrack?.artist || 'Unknown Artist'
            }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-6 justify-center w-1/3">
          <button class="text-white/70 hover:text-white transition-colors" @click="playPrevious">
            <i class="pi pi-step-backward text-xl"></i>
          </button>

          <button
            class="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            @click="store.togglePlay()"
          >
            <i :class="['pi text-2xl ml-1', isPlaying ? 'pi-pause !ml-0' : 'pi-play']"></i>
          </button>

          <button class="text-white/70 hover:text-white transition-colors" @click="playNext">
            <i class="pi pi-step-forward text-xl"></i>
          </button>
        </div>

        <!-- Extra Controls (Volume & Sidebar) -->
        <div class="flex items-center gap-4 justify-end w-1/3">
          <div class="flex items-center gap-2 group">
            <button class="text-white/70 hover:text-white transition-colors" @click="toggleMute">
              <i :class="['pi', volume === 0 ? 'pi-volume-off' : 'pi-volume-up']"></i>
            </button>
            <div
              class="w-20 h-1.5 bg-white/10 rounded-full cursor-pointer relative"
              @click="handleVolumeChange($event)"
            >
              <div
                class="absolute top-0 left-0 h-full bg-white/80 rounded-full"
                :style="{ width: `${volume}%` }"
              ></div>
            </div>
          </div>
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            :class="
              isSidebarOpen
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-white/70 hover:text-white bg-white/5'
            "
            @click="store.toggleSidebar()"
          >
            <i class="pi pi-list"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '../store/useMusicStore'
import { storeToRefs } from 'pinia'

const store = useMusicStore()
const { currentTrack, isPlaying, volume, progress, isSidebarOpen, tracks } = storeToRefs(store)

const handleSeek = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const percentage = (x / rect.width) * 100
  store.setProgress(percentage)
  window.dispatchEvent(new CustomEvent('musicSeekTo', { detail: percentage }))
}

const handleVolumeChange = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  const percentage = (x / rect.width) * 100
  store.setVolume(percentage)
}

const toggleMute = () => {
  if (volume.value > 0) {
    store.setVolume(0)
  } else {
    store.setVolume(50)
  }
}

const playNext = () => {
  if (!currentTrack.value || tracks.value.length === 0) return
  const currentIndex = tracks.value.findIndex((t) => t.id === currentTrack.value?.id)
  const nextTrack = tracks.value[(currentIndex + 1) % tracks.value.length]
  if (nextTrack) store.playTrack(nextTrack.id)
}

const playPrevious = () => {
  if (!currentTrack.value || tracks.value.length === 0) return
  const currentIndex = tracks.value.findIndex((t) => t.id === currentTrack.value?.id)
  const prevTrack = tracks.value[(currentIndex - 1 + tracks.value.length) % tracks.value.length]
  if (prevTrack) store.playTrack(prevTrack.id)
}
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>

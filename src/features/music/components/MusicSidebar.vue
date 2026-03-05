<template>
  <div class="w-80 border-l z-40 ease-in-out p-6 flex flex-col gap-8 overflow-y-auto">
    <!-- Themes -->
    <div class="flex flex-col gap-3 mt-12">
      <h3 class="text-white/90 text-sm font-bold tracking-wider uppercase">Vibe</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="theme in themes"
          :key="theme.id"
          class="relative rounded-xl overflow-hidden aspect-video border transition-all"
          :class="
            currentThemeId === theme.id
              ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
              : 'border-transparent hover:border-white/20'
          "
          @click="store.setTheme(theme.id)"
        >
          <img :src="theme.imageUrl" class="absolute inset-0 w-full h-full object-cover" />
          <div
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left"
          >
            <span class="text-white text-[10px] font-medium">{{ theme.name }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Playlist -->
    <div class="flex flex-col gap-3 flex-1">
      <div class="flex items-center justify-between">
        <h3 class="text-white/90 text-sm font-bold tracking-wider uppercase">Playlist</h3>
      </div>

      <div class="flex flex-col gap-2">
        <div
          v-for="track in tracks"
          :key="track.id"
          class="p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border border-transparent backdrop-blur-sm group"
          :class="
            currentTrack?.id === track.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'hover:bg-white/5'
          "
          @click="store.playTrack(track.id)"
        >
          <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative bg-slate-800">
            <img v-if="track.thumbnail" :src="track.thumbnail" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i
                class="pi"
                :class="
                  track.type === 'youtube' ? 'pi-youtube text-red-400' : 'pi-music text-slate-400'
                "
              ></i>
            </div>
            <div
              v-if="currentTrack?.id === track.id && isPlaying"
              class="flex items-center justify-center backdrop-blur-[1px]"
            >
              <div class="flex items-end gap-[2px] h-4">
                <div
                  class="w-1 bg-cyan-400 rounded-full animate-bounce"
                  style="animation-delay: 0.1s"
                ></div>
                <div
                  class="w-1 bg-cyan-400 rounded-full animate-bounce"
                  style="animation-delay: 0.2s; height: 12px"
                ></div>
                <div
                  class="w-1 bg-cyan-400 rounded-full animate-bounce"
                  style="animation-delay: 0.3s; height: 8px"
                ></div>
              </div>
            </div>
          </div>

          <div class="flex flex-col overflow-hidden flex-1">
            <span
              class="text-sm font-medium truncate"
              :class="currentTrack?.id === track.id ? 'text-cyan-400' : 'text-white/90'"
              >{{ track.title }}</span
            >
            <span class="text-[10px] text-white/50 truncate uppercase tracking-widest">{{
              track.artist || track.type
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add custom Youtube -->
    <div class="flex flex-col gap-3 pb-24">
      <h3 class="text-white/90 text-sm font-bold tracking-wider uppercase">Add YouTube Link</h3>
      <form @submit.prevent="handleAddYoutube" class="flex gap-2">
        <input
          v-model="newYoutubeLink"
          type="text"
          placeholder="Paste URL (e.g., https://youtu.be/...)"
          class="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/5 transition-all"
        />
        <button
          type="submit"
          class="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newYoutubeLink"
        >
          <i class="pi pi-plus"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMusicStore } from '../store/useMusicStore'
import { storeToRefs } from 'pinia'

const store = useMusicStore()
const { themes, currentThemeId, tracks, currentTrack, isPlaying } = storeToRefs(store)

const newYoutubeLink = ref('')

const handleAddYoutube = () => {
  if (!newYoutubeLink.value) return
  // extract video ID
  const url = newYoutubeLink.value
  let videoId = ''

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[2] && match[2].length === 11) {
    videoId = match[2]
  } else {
    if (url.length === 11) {
      videoId = url
    }
  }

  if (videoId) {
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        store.addTrack({
          id: `yt-${Date.now()}`,
          title: data.title || `YouTube Video (${videoId})`,
          artist: data.author_name || 'Custom URL',
          type: 'youtube',
          url: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        })
      })
      .catch(() => {
        // Fallback if noembed fails
        store.addTrack({
          id: `yt-${Date.now()}`,
          title: `YouTube Video (${videoId})`,
          artist: 'Custom URL',
          type: 'youtube',
          url: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        })
      })
    newYoutubeLink.value = ''
  } else {
    alert('Invalid YouTube Link')
  }
}
</script>

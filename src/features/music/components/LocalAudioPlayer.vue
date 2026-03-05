<template>
  <audio 
    ref="audioRef" 
    class="hidden" 
    @timeupdate="onTimeUpdate"
    @ended="onEnded"
    @loadedmetadata="onLoadedMetadata"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMusicStore } from '../store/useMusicStore'
import { storeToRefs } from 'pinia'

const store = useMusicStore()
const { currentTrack, isPlaying, volume } = storeToRefs(store)
const audioRef = ref<HTMLAudioElement | null>(null)
let isDraggingProgress = false

watch(currentTrack, (newTrack) => {
  if (newTrack && newTrack.type === 'local' && audioRef.value) {
    if (audioRef.value.src !== new URL(newTrack.url, window.location.origin).href) {
      audioRef.value.src = newTrack.url
    }
    if (isPlaying.value) {
      audioRef.value.play().catch(e => console.error(e))
    }
  } else if (audioRef.value) {
    audioRef.value.pause()
  }
})

watch(isPlaying, (newPlaying) => {
  if (currentTrack.value?.type !== 'local' || !audioRef.value) return
  if (newPlaying) {
    audioRef.value.play().catch(e => console.error(e))
  } else {
    audioRef.value.pause()
  }
})

watch(volume, (newVol) => {
  if (audioRef.value) {
    audioRef.value.volume = newVol / 100
  }
})

// Can't easily watch store progress while it updates from here, 
// so we'll have a global event bus or method to seek. 
// For now let's just expose a seekTo method if we need it. 

// Expose internal methods to window for the controller to use, or store actions
window.addEventListener('musicSeekTo', (e: any) => {
  if (currentTrack.value?.type === 'local' && audioRef.value && e.detail !== undefined) {
    const time = (e.detail / 100) * audioRef.value.duration
    if (!isNaN(time)) {
      audioRef.value.currentTime = time
    }
  }
})

const onTimeUpdate = () => {
  if (audioRef.value && audioRef.value.duration) {
    const currentProgress = (audioRef.value.currentTime / audioRef.value.duration) * 100
    store.setProgress(currentProgress)
  }
}

const onEnded = () => {
  store.isPlaying = false
  // optionally auto-play next track here
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
  }
}

onMounted(() => {
  if (audioRef.value && currentTrack.value?.type === 'local') {
    audioRef.value.src = currentTrack.value.url
  }
})
</script>

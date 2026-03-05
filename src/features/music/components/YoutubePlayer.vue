<template>
  <div id="youtube-player-container" class="hidden"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, onUnmounted } from 'vue'
import { useMusicStore } from '../store/useMusicStore'
import { storeToRefs } from 'pinia'

const store = useMusicStore()
const { currentTrack, isPlaying, volume } = storeToRefs(store)

let player: any = null
let progressInterval: number | null = null

const loadYouTubeAPI = () => {
  return new Promise<void>((resolve) => {
    if ((window as any).YT && (window as any).YT.Player) {
      resolve()
      return
    }
    const tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName('script')[0]
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    } else {
      document.head.appendChild(tag)
    }

    ;(window as any).onYouTubeIframeAPIReady = () => {
      resolve()
    }
  })
}

const initPlayer = async () => {
  await loadYouTubeAPI()
  player = new (window as any).YT.Player('youtube-player-container', {
    height: '0',
    width: '0',
    videoId: currentTrack.value?.type === 'youtube' ? currentTrack.value.url : '',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  })
}

const onPlayerReady = (event: any) => {
  event.target.setVolume(volume.value)
  if (isPlaying.value && currentTrack.value?.type === 'youtube') {
    event.target.playVideo()
  }
}

const onPlayerStateChange = (event: any) => {
  // YT.PlayerState.PLAYING = 1
  // YT.PlayerState.PAUSED = 2
  // YT.PlayerState.ENDED = 0
  if (event.data === 1) { // Playing
    store.isPlaying = true
    startProgressTracking()
  } else if (event.data === 2) { // Paused
    store.isPlaying = false
    stopProgressTracking()
  } else if (event.data === 0) { // Ended
    store.isPlaying = false
    stopProgressTracking()
  }
}

const startProgressTracking = () => {
  stopProgressTracking()
  progressInterval = window.setInterval(() => {
    if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
      const current = player.getCurrentTime()
      const total = player.getDuration()
      if (total > 0) {
        store.setProgress((current / total) * 100)
      }
    }
  }, 1000)
}

const stopProgressTracking = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

watch(currentTrack, (newTrack) => {
  if (newTrack && newTrack.type === 'youtube' && player && typeof player.loadVideoById === 'function') {
    player.loadVideoById(newTrack.url)
    if (isPlaying.value) {
      player.playVideo()
    } else {
      player.pauseVideo()
    }
  } else if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo()
  }
})

watch(isPlaying, (newPlaying) => {
  if (currentTrack.value?.type !== 'youtube' || !player || typeof player.playVideo !== 'function') return
  if (newPlaying) {
    player.playVideo()
  } else {
    player.pauseVideo()
  }
})

watch(volume, (newVol) => {
  if (player && typeof player.setVolume === 'function') {
    player.setVolume(newVol)
  }
})

window.addEventListener('musicSeekTo', (e: any) => {
  if (currentTrack.value?.type === 'youtube' && player && typeof player.seekTo === 'function' && typeof player.getDuration === 'function' && e.detail !== undefined) {
    const time = (e.detail / 100) * player.getDuration()
    player.seekTo(time, true)
  }
})

onMounted(() => {
  initPlayer()
})

onUnmounted(() => {
  stopProgressTracking()
  if (player && typeof player.destroy === 'function') {
    player.destroy()
  }
})
</script>

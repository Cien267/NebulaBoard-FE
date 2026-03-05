import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Track, Theme } from '../types'

export const useMusicStore = defineStore('music', () => {
  // State
  const tracks = ref<Track[]>([])
  const currentTrackId = ref<string | null>(null)
  const isPlaying = ref(false)
  const volume = ref(50)
  const progress = ref(0) // 0 to 100
  const isSidebarOpen = ref(true)

  const themes = ref<Theme[]>([
    {
      id: 'default',
      name: 'Cozy Night',
      imageUrl: '/images/lofi/lofi_cozy_room_night.png'
    },
    {
      id: 'rainy',
      name: 'Rainy Afternoon',
      imageUrl: '/images/lofi/lofi_rainy_afternoon.png'
    },
    {
      id: 'neon',
      name: 'Neon City',
      imageUrl: '/images/lofi/lofi_neon_city.png'
    }
  ])
  const currentThemeId = ref<string>('default')

  // Getters
  const currentTrack = computed(() => 
    tracks.value.find(t => t.id === currentTrackId.value) || null
  )

  const currentTheme = computed(() =>
    themes.value.find(t => t.id === currentThemeId.value) || themes.value[0]
  )

  // Actions
  function addTrack(track: Track) {
    if (!tracks.value.find(t => t.id === track.id)) {
      tracks.value.push(track)
    }
  }

  function playTrack(id: string) {
    currentTrackId.value = id
    isPlaying.value = true
  }

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function setVolume(val: number) {
    volume.value = Math.max(0, Math.min(100, val))
  }

  function setProgress(val: number) {
    progress.value = Math.max(0, Math.min(100, val))
  }

  function setTheme(id: string) {
    if (themes.value.find(t => t.id === id)) {
      currentThemeId.value = id
    }
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function loadInitialData() {
    // Add default test tracks
    addTrack({
      id: 'lofi-girl',
      title: 'Lofi Girl - chill beats to relax/study to',
      artist: 'Lofi Girl',
      url: 'jfKfPfyJRdk',
      type: 'youtube',
      thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg'
    })
    addTrack({
      id: 'local-test1',
      title: 'Local Test Track 1',
      artist: 'System',
      url: '/audio/test.mp3',
      type: 'local',
      thumbnail: '/images/lofi/lofi_cozy_room_night.webp'
    })
  }

  return {
    // State
    tracks,
    currentTrackId,
    isPlaying,
    volume,
    progress,
    isSidebarOpen,
    themes,
    currentThemeId,
    
    // Getters
    currentTrack,
    currentTheme,

    // Actions
    addTrack,
    playTrack,
    togglePlay,
    setVolume,
    setProgress,
    setTheme,
    toggleSidebar,
    loadInitialData
  }
})

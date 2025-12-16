<template>
  <div class="fixed top-20 left-10 z-9999">
    <div class="relative">
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="absolute top-0 left-0 w-20 h-20 rounded-full bg-linear-to-br from-slate-200 to-slate-300 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center z-10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <div
          class="w-16 h-16 rounded-full bg-linear-to-br from-slate-100 to-slate-200 shadow-[inset_0_4px_12px_rgba(0,0,0,0.1),0_0_20px_rgba(100,116,139,0.15)] hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.1),0_0_20px_rgba(14,165,233,0.9)] flex items-center justify-center"
        >
          <div class="text-slate-600 text-xs font-bold tracking-wider">
            {{ isMenuOpen ? 'CLOSE' : 'MENU' }}
          </div>
        </div>
      </button>
      <div className="absolute top-20 left-10 w-0.5 h-6 bg-slate-300 shadow-sm z-999" />
      <div
        class="absolute top-26 left-10 -translate-x-1/2 px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
      >
        <p class="text-cyan-600 text-xs font-extrabold tracking-wide">
          {{ activeItemLabel }}
        </p>
      </div>
      <button
        v-for="(item, index) in navItems"
        :key="item.id"
        @click="handleSelectItem(item.id)"
        @mouseenter="hoveredItem = item.id"
        @mouseleave="hoveredItem = null"
        class="absolute group cursor-pointer"
        :style="getButtonStyle(index)"
      >
        <div
          class="relative w-20 h-20 rounded-2xl transition-all duration-400"
          :class="getButtonClass(item.id)"
          :style="getButtonTransform(item.id)"
        >
          <div
            class="absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent rounded-full"
          />

          <!-- Icon container -->
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
              :class="getIconContainerClass(item.id)"
              :style="getIconTransform(item.id)"
            >
              <span
                class="text-sm transition-colors duration-300"
                :class="activeItem === item.id ? 'opacity-100' : 'opacity-80'"
              >
                <component :is="item.icon" />
              </span>
            </div>

            <span
              class="text-[10px] tracking-wide transition-colors duration-300"
              :class="
                activeItem === item.id
                  ? 'text-sky-700 font-extrabold'
                  : 'text-slate-500 font-medium'
              "
            >
              {{ item.label }}
            </span>
          </div>

          <div
            v-if="activeItem === item.id"
            class="absolute -inset-1 rounded-3xl bg-cyan-500/10 blur-xl animate-pulse"
          />

          <div
            v-if="hoveredItem === item.id && activeItem !== item.id"
            class="absolute -inset-1 rounded-3xl bg-slate-400/15 blur-lg"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, type CSSProperties } from 'vue'
import DashboardIcon from '../icons/DashboardIcon.vue'
import NoteIcon from '../icons/NoteIcon.vue'
import TaskIcon from '../icons/TaskIcon.vue'
import JournalIcon from '../icons/JournalIcon.vue'
import MusicIcon from '../icons/MusicIcon.vue'
import SettingIcon from '../icons/SettingIcon.vue'

const navItems = shallowRef([
  { id: 'settings', label: 'Settings', icon: SettingIcon, isActive: false },
  { id: 'music', label: 'Music', icon: MusicIcon, isActive: false },
  { id: 'journal', label: 'Journal', icon: JournalIcon, isActive: false },
  { id: 'tasks', label: 'Tasks', icon: TaskIcon, isActive: false },
  { id: 'notes', label: 'Notes', icon: NoteIcon, isActive: false },
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, isActive: true },
])

const activeItem = ref('dashboard')
const hoveredItem = ref<string | null>(null)
const isMenuOpen = ref(false)

const activeItemLabel = computed(() => {
  return navItems.value.find((item) => item.id === activeItem.value)?.label
})

const handleSelectItem = (itemId: string) => {
  activeItem.value = itemId
  navItems.value.forEach((item) => {
    item.isActive = item.id === itemId
  })
  navItems.value.sort((a, b) => Number(a.isActive) - Number(b.isActive))
}

const getButtonStyle = (index: number): CSSProperties => {
  const angle = index * (90 / (navItems.value.length - 1)) * (Math.PI / 180)
  const radius = 220
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius

  return {
    left: `${x + 10}px`,
    top: `${y + 10}px`,
    transition: `all ${index / 3}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
    opacity: isMenuOpen.value ? 1 : 0,
    pointerEvents: isMenuOpen.value ? 'auto' : 'none',
    scale: isMenuOpen.value ? 1 : 0.8,
  }
}

const getButtonClass = (itemId: string) => {
  const isActive = activeItem.value === itemId
  return isActive
    ? 'shadow-[0_2px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_8px_rgba(0,0,0,0.05),0_0_20px_rgba(14,165,233,0.9)]'
    : 'shadow-[0_5px_15px_rgba(0,0,0,0.35)]'
}

const getButtonTransform = (itemId: string) => {
  const isActive = activeItem.value === itemId
  const isHovered = hoveredItem.value === itemId

  const background =
    'linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 50%, rgb(226, 232, 240) 100%)'

  const transform = isActive
    ? 'translateY(2px) scale(1.05)'
    : isHovered
      ? 'translateX(10px) translateY(-10px) scale(1.05)'
      : 'translateX(0) scale(1)'

  return {
    background,
    transform,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }
}

const getIconContainerClass = (itemId: string) => {
  const isActive = activeItem.value === itemId
  return isActive
    ? 'bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3),inset_0_2px_8px_rgba(6,182,212,0.15)]'
    : 'bg-slate-200/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]'
}

const getIconTransform = (itemId: string) => {
  const isHovered = hoveredItem.value === itemId
  return {
    transform: isHovered ? 'scale(1.1) rotateY(5deg)' : 'scale(1)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

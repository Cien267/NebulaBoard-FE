import { ref, computed, shallowRef } from 'vue'
import DashboardIcon from '@/components/icons/DashboardIcon.vue'
import NoteIcon from '@/components/icons/NoteIcon.vue'
import TaskIcon from '@/components/icons/TaskIcon.vue'
import JournalIcon from '@/components/icons/JournalIcon.vue'
import MusicIcon from '@/components/icons/MusicIcon.vue'
import SettingIcon from '@/components/icons/SettingIcon.vue'

const LOCALSTORAGE_ACTIVE_ITEM_KEY = 'activeItem'
const isMenuOpen = ref(false)
const navItems = shallowRef([
  { id: 'settings', label: 'Settings', icon: SettingIcon, isActive: false },
  { id: 'music', label: 'Music', icon: MusicIcon, isActive: false },
  { id: 'journal', label: 'Journal', icon: JournalIcon, isActive: false },
  { id: 'tasks', label: 'Tasks', icon: TaskIcon, isActive: false },
  { id: 'notes', label: 'Notes', icon: NoteIcon, isActive: false },
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, isActive: true },
])
const activeItem = ref(localStorage.getItem(LOCALSTORAGE_ACTIVE_ITEM_KEY) ?? 'dashboard')
const activeItemLabel = computed(() => {
  return navItems.value.find((item) => item.id === activeItem.value)?.label
})

export const useAppMenu = () => {
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const handleUpdateActiveItem = (itemId: string) => {
    activeItem.value = itemId
    localStorage.setItem(LOCALSTORAGE_ACTIVE_ITEM_KEY, itemId)
    navItems.value.forEach((item) => {
      item.isActive = item.id === itemId
    })
    navItems.value.sort((a, b) => Number(a.isActive) - Number(b.isActive))
    isMenuOpen.value = false
  }

  return {
    isMenuOpen,
    navItems,
    activeItem,
    activeItemLabel,
    toggleMenu,
    handleUpdateActiveItem,
  }
}

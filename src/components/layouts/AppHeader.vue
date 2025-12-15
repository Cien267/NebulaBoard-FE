<template>
  <header class="bg-slate-50 shadow-md border-only-bottom border-gray-100">
    <div class="max-w-wull mx-auto px-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 w-32 lg:w-56">
            <router-link to="/dashboard">
              <Image src="/favicon.ico" alt="logo" width="30" />
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <Menu ref="profileMenu" :model="profileMenuItems" :popup="true" class="w-56" />
          <Button
            :label="userDisplayName"
            icon="pi pi-user"
            text
            severity="secondary"
            @click="toggleProfileMenu"
            class="flex items-center gap-2"
          />
        </div>
      </div>
    </div>
  </header>
  <Toast position="bottom-right" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Image from 'primevue/image'
import { useAuth } from '@/composables/useAuth'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { ROUTER_NAME_LIST } from '@/constants/routers'

const toast = useToast()
const router = useRouter()
const { handleLogout, user } = useAuth()
const profileMenu = ref()

const userDisplayName = computed(() => {
  return user.value?.name || 'Mr. Productivity'
})

const profileMenuItems = [
  {
    label: 'Edit Profile',
    icon: 'pi pi-user-edit',
    command: () => {},
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: async () => {
      try {
        await handleLogout()
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logout successfully',
          life: 3000,
        })
        router.push({ name: ROUTER_NAME_LIST.LOGIN_PAGE })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Logout unsuccessfully, please try again',
          life: 3000,
        })
        console.error('Logout error:', error)
      }
    },
  },
]

function toggleProfileMenu(event: Event) {
  profileMenu.value?.toggle(event)
}
</script>

<style scoped></style>

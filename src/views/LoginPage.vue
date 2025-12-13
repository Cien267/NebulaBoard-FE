<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import CustomAnimatedProductivityIcon from '@/components/icons/CustomAnimatedProductivityIcon.vue'
import { LoginRequestSchema } from '@/types/auth'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const email = ref('')
const password = ref('')
const submitting = ref(false)
const errors = ref<{ email?: string; password?: string }>({})

const schema = LoginRequestSchema

const { handleLogin } = useAuth()
const router = useRouter()

async function onSubmit() {
  errors.value = {}
  const result = schema.safeParse({ email: email.value, password: password.value })
  if (!result.success) {
    for (const issue of result.error.issues) {
      if (issue.path[0] === 'email') errors.value.email = String(issue.message)
      if (issue.path[0] === 'password') errors.value.password = String(issue.message)
    }
    return
  }

  submitting.value = true
  try {
    const ok = await handleLogin({ email: email.value, password: password.value })
    if (ok) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successfully',
        life: 3000,
      })
      await router.push({ name: ROUTER_NAME_LIST.DASHBOARD_PAGE })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Login unsuccessfully, please check your credentials',
        life: 3000,
      })
    }
  } catch (error: any) {
    const eMsg = error?.response?.data?.message ?? 'An error occurred during login'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: eMsg,
      life: 3000,
    })
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <div class="h-screen relative bg-white flex">
    <div class="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-9999">
      <CustomAnimatedProductivityIcon />
    </div>
    <div class="flex-1 flex flex-col items-center justify-center p-8">
      <div class="bg-white shadow-2xl rounded-2xl border border-gray-100 mx-auto w-full lg:w-3/4">
        <div class="p-6 sm:p-8">
          <div class="text-center">
            <h2 class="text-2xl font-semibold text-gray-800">Welcome back</h2>
            <p class="text-sm text-gray-500 mt-2">Sign in and continue your productive flow</p>
          </div>

          <form class="mt-6 space-y-5" @submit.prevent="onSubmit">
            <div class="space-y-2">
              <label for="email" class="block text-sm font-bold text-gray-700">Email</label>
              <InputText
                id="email"
                v-model="email"
                type="email"
                placeholder="example@gmail.com"
                autocomplete="email"
                :invalid="!!errors.email"
                class="w-full"
              />
              <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
            </div>

            <div class="space-y-2">
              <label for="password" class="block text-sm font-bold text-gray-700">Password</label>
              <Password
                id="password"
                v-model="password"
                toggleMask
                :feedback="false"
                placeholder="******"
                autocomplete="current-password"
                class="w-full"
              />
              <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
            </div>
            <Button type="submit" label="Login" :loading="submitting" class="w-full" />
          </form>
        </div>
      </div>

      <p class="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <router-link
          to="/register"
          class="text-sky-700! hover:text-sky-800! no-underline font-bold"
        >
          Register</router-link
        >
      </p>
    </div>
    <div
      class="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-12 relative"
      id="right-side-image"
    >
      <div
        class="bg-black/50 p-4 pl-18 rounded-lg [clip-path:polygon(6.5%_0%,100%_0%,100%_100%,6.5%_100%,0%_50%)]"
      >
        <h2 class="text-4xl font-extrabold text-white mb-4">Stay Focused, Stay Productive</h2>
        <p class="text-white">
          Nebula Board helps you organize tasks, notes, and ideas in a calm, distraction-free
          workspace made for deep work.
        </p>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" />
</template>
<style scoped>
#right-side-image {
  background-image: url('@/assets/images/login-image.webp');
  background-size: cover;
  background-position: center;
  clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%);
}
</style>

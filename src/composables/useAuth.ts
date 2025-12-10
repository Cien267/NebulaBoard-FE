import { ref } from 'vue'
import { login } from '@/services/authService'
import type { LoginRequest } from '@/types/auth'
import Cookies from 'js-cookie'

const COOKIES_TOKEN_NAME = 'nebulaboard-token'
const LOCALSTORAGE_USER = 'nebulaboard-user'
const token = ref(Cookies.get(COOKIES_TOKEN_NAME) || null)
const user = ref(JSON.parse(localStorage.getItem(LOCALSTORAGE_USER) || '{}') || null)

const handleLogin = async (credentials: LoginRequest) => {
  try {
    const response = await login(credentials)
    const tokenUser = response?.tokens?.access?.token
    const expires = response?.tokens?.access?.expires
    token.value = tokenUser
    user.value = response?.user
    Cookies.set(COOKIES_TOKEN_NAME, tokenUser, { expires: expires ? new Date(expires) : 1 })
    localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(response?.user))
  } catch (error) {
    console.error('Login failed', error)
    throw error
  }
}

const handleLogout = () => {
  token.value = null
  user.value = null
  Cookies.remove(COOKIES_TOKEN_NAME)
  localStorage.removeItem(LOCALSTORAGE_USER)
}

export const useAuth = () => {
  return {
    token,
    user,
    handleLogin,
    handleLogout,
  }
}

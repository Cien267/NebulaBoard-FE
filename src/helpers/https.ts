import axios from 'axios'
import { unref } from 'vue'
import type { AxiosInstance } from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'

const router = useRouter()
const timeout = 30000
const baseUrl = import.meta.env.VITE_BASE_URL

/**
 * Creates an Axios instance with preconfigured settings for API requests.
 * @type {AxiosInstance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
})

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuth()
    const tokenValue = unref(token)
    if (tokenValue && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${tokenValue}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      router.push({ name: ROUTER_NAME_LIST.LOGIN_PAGE })
    }
    return Promise.reject(error)
  },
)

export const handleApiError = (error: any): never => {
  if (error.code === 'ERR_CANCELED') {
    console.log('Request aborted:', error.message)
    throw error
  } else if (error.response) {
    const { data, status, statusText } = error.response
    throw data !== '' && data ? data : { message: `${status} ${statusText}` }
  } else {
    throw error
  }
}

export default apiClient

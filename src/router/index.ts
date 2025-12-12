import { createRouter, createWebHistory } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'
import NotFoundPage from '@/views/NotFoundPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import { useAuth } from '@/composables/useAuth'

const { token } = useAuth()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: ROUTER_NAME_LIST.LOGIN_PAGE,
      component: LoginPage,
      meta: { transition: 'slide-fade-left' },
    },
    {
      path: '/register',
      name: ROUTER_NAME_LIST.REGISTER_PAGE,
      component: RegisterPage,
      meta: { transition: 'slide-fade-right' },
    },
    {
      path: '/dashboard',
      name: ROUTER_NAME_LIST.DASHBOARD_PAGE,
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
    { path: `/:notFound(.*)`, component: NotFoundPage },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.name === ROUTER_NAME_LIST.LOGIN_PAGE && token.value) {
    next({ name: ROUTER_NAME_LIST.DASHBOARD_PAGE })
    return
  }
  if (to.meta.requiresAuth && !token.value) {
    next({ name: ROUTER_NAME_LIST.LOGIN_PAGE })
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'
import NotFoundPage from '@/views/NotFoundPage.vue'
import LoginPage from '@/features/auth/views/LoginPage.vue'
import RegisterPage from '@/features/auth/views/RegisterPage.vue'
import DashboardPage from '@/features/dashboard/views/DashboardPage.vue'
import { useAuth } from '@/features/auth/composables/useAuth'
import TaskPage from '@/features/tasks/views/TaskPage.vue'

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
      meta: { requiresAuth: false },
    },
    // {
    //   path: '/notes',
    //   name: ROUTER_NAME_LIST.NOTES_PAGE,
    //   component: DashboardPage,
    //   meta: { requiresAuth: false },
    // },
    {
      path: '/tasks',
      name: ROUTER_NAME_LIST.TASKS_PAGE,
      component: TaskPage,
      meta: { requiresAuth: false },
    },
    // {
    //   path: '/journal',
    //   name: ROUTER_NAME_LIST.JOURNAL_PAGE,
    //   component: DashboardPage,
    //   meta: { requiresAuth: false },
    // },
    // {
    //   path: '/music',
    //   name: ROUTER_NAME_LIST.MUSIC_PAGE,
    //   component: DashboardPage,
    //   meta: { requiresAuth: false },
    // },
    // {
    //   path: '/settings',
    //   name: ROUTER_NAME_LIST.SETTINGS_PAGE,
    //   component: DashboardPage,
    //   meta: { requiresAuth: false },
    // },
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

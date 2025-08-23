import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useUserStore } from 'src/stores/user-store'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // 🔹 Global Navigation Guard
  Router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (!userStore.uid) {
      userStore.loadUser?.()
    }

    // Protect applicant/recruiter routes
    if (to.path.startsWith('/applicant') && userStore.role !== 'applicant') {
      return next({ name: 'login' })
    }
    if (to.path.startsWith('/recruiter') && userStore.role !== 'recruiter') {
      return next({ name: 'login' })
    }

    // Auto-redirect "all-jobs"
    if (to.name === 'GuestJobs') {
      if (userStore.role === 'applicant') return next({ name: 'ApplicantJobs' })
      if (userStore.role === 'recruiter') return next({ name: 'RecruiterJobs' })
    }

    // Auto-redirect "special-feature"
    if (to.name === 'GuestSpecial') {
      if (userStore.role === 'applicant') return next({ name: 'ApplicantSpecial' })
      if (userStore.role === 'recruiter') return next({ name: 'RecruiterSpecial' })
    }

    next()
  })

  return Router
})

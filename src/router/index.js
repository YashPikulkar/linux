// router/index.js
import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useUserStore } from 'src/stores/user-store'
import { jwtDecode } from 'jwt-decode' // ✅ named import for v4+

export default defineRouter(function () {
  // Determine history type
  const createHistory =
    process.env.SERVER === 'true'
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === 'history'
        ? createWebHistory
        : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE || '/'),
  })

  Router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const token = userStore?.token || null

    let userRole = null

    if (token) {
      try {
        const decoded = jwtDecode(token)
        userRole = decoded.role
      } catch (err) {
        console.error('Invalid token:', err)
        return next({ name: 'login' })
      }
    }

    // Prevent logged-in users from accessing login/register
    if (token && (to.name === 'login' || to.name === 'register')) {
      const redirectTo =
        to.query.redirect ||
        (userRole === 'applicant' ? 'ApplicantHome' : 'RecruiterHome') ||
        'index'
      return next({ name: redirectTo })
    }

    // Find required role from matched routes (including parent)
    const matchedRoute = to.matched.find((r) => r.meta?.role)
    const requiredRole = matchedRoute?.meta?.role

    // Public route
    if (!requiredRole) return next()

    // Not logged in → redirect to login with redirect
    if (!token) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Role mismatch → redirect to previous page or dashboard
    if (requiredRole !== userRole) {
      const redirectTo =
        from.name || (userRole === 'applicant' ? 'ApplicantHome' : 'RecruiterHome') || 'index'
      return next({ name: redirectTo })
    }

    // Role matches → allow
    return next()
  })

  return Router
})

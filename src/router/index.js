// src/router/index.js
import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import routes from './routes'

export default defineRouter(() => {
  const history = process.env.SERVER
    ? createMemoryHistory(process.env.VUE_ROUTER_BASE)
    : (process.env.VUE_ROUTER_MODE === 'history'
        ? createWebHistory(process.env.VUE_ROUTER_BASE)
        : createWebHashHistory(process.env.VUE_ROUTER_BASE))

  return createRouter({
    history,
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 })
  })
})

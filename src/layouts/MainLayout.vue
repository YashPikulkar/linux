<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- Header -->
    <land-header />

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'
import LandHeader from 'src/components/navbar/LandHeader.vue'

const router = useRouter()
const userStore = useUserStore()

// 🔹 Optional: Route Guard Logic (for role-based protection)
router.beforeEach((to, from, next) => {
  const role = userStore.role
  if (to.path.startsWith('/applicant') && role !== 'applicant') return next('/login')
  if (to.path.startsWith('/recruiter') && role !== 'recruiter') return next('/login')
  next()
})
</script>

<style scoped>
.main-layout {
  background-color: #f9fafb;
}
</style>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from 'src/stores/user-store'

// layouts
import MainLayout from './MainLayout.vue'
import DashboardLayout from './DashboardLayout.vue'

const userStore = useUserStore()

// pick layout dynamically
const layout = computed(() => (userStore.isLoggedIn ? DashboardLayout : MainLayout))
</script>

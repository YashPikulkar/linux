<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from './stores/user-store'

const userStore = useUserStore()
userStore.loadUser() // ✅ restores user state on page reload
</script>

<template>
  <div class="settings-layout">
    <aside class="sidebar">
      <q-list>
        <q-item v-for="item in menuItems" :key="item.name" clickable @click="active = item.name" :active="active === item.name">
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </aside>

    <main class="content">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Account from './Account.vue'
import Profile from './Profile.vue'
import Resume from './Resume.vue'

const active = ref('account')

const menuItems = [
  { name: 'account', label: 'Account', icon: 'person' },
  { name: 'profile', label: 'Profile', icon: 'badge' },
  { name: 'resume', label: 'Resume', icon: 'description' },
]

const currentComponent = computed(() => {
  switch (active.value) {
    case 'account': return Account
    case 'profile': return Profile
    case 'resume': return Resume
    default: return Account
  }
})
</script>

<style scoped>
.settings-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  padding: 2rem;
}
.sidebar {
  background: #f7f7f7;
  border-radius: 8px;
  padding: 1rem;
}
.content {
  padding: 1rem;
}
</style>

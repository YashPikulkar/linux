<template>
  <q-header elevated class="navbar">
    <q-toolbar class="q-px-none">
      <!-- Logo on left -->
      <div class="logo-container">
        <img src="../../assets/logo.png" alt="Company Logo" class="logo" />
        <span class="company-name">TalentConnect</span>
      </div>

      <q-space />

      <!-- Desktop Navigation -->
      <div class="desktop-nav gt-sm">
        <q-btn
          v-for="nav in navigation"
          :key="nav.name"
          flat
          exact
          class="nav-btn"
          :class="{ active: currentSection === nav.name }"
          @click="handleNavClick(nav)"
        >
          {{ nav.label }}
        </q-btn>
        <q-btn flat exact class="nav-btn" @click="confirmLogout"> Log out </q-btn>
      </div>

      <!-- Mobile menu button -->
      <q-btn
        flat
        dense
        round
        color="black"
        icon="menu"
        aria-label="Menu"
        class="lt-md"
        @click="toggleRightDrawer"
      />
    </q-toolbar>

    <!-- Mobile Drawer -->
    <q-drawer v-model="rightDrawerOpen" side="right" bordered class="mobile-drawer">
      <q-list>
        <q-item-label header class="drawer-header">Menu</q-item-label>
        <q-item
          v-for="nav in navigation"
          :key="nav.name"
          clickable
          class="drawer-item"
          :class="{ active: currentSection === nav.name }"
          @click="handleMobileNavClick(nav)"
        >
          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
        </q-item>
        
        <!-- Mobile Logout Option -->
        <q-item clickable class="drawer-item" @click="confirmLogout">
          <q-item-section>
            <q-item-label>Log out</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Logout Confirmation Dialog -->
    <q-dialog v-model="showLogoutDialog" persistent>
      <q-card class="logout-card q-pa-lg">
        <!-- Header -->
        <q-card-section class="row items-center q-pb-md">
          <q-icon name="logout" color="negative" size="48px" class="q-mr-md" />
          <div class="text-h6 text-weight-medium">Confirm Logout</div>
        </q-card-section>

        <!-- Message -->
        <q-card-section class="q-pt-none text-body1 text-grey-8">
          Are you sure you want to log out of your account? Any unsaved changes will be lost.
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat label="Cancel" color="primary" @click="handleLogoutCancel" />
          <q-btn unelevated label="Log out" color="negative" @click="handleLogoutConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-header>
</template>

<script setup>
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const rightDrawerOpen = ref(false)
const showLogoutDialog = ref(false)
const router = useRouter()

// Define props correctly
const props = defineProps({
  current: String,
  navigation: {
    type: Array,
    required: true,
  },
})

// Define emits for updating parent component
const emit = defineEmits(['update:current'])

// Don't wrap props.navigation in ref - use it directly
const { navigation } = props

// Create a computed property for current that can be updated
const currentSection = computed({
  get: () => props.current,
  set: (value) => emit('update:current', value)
})

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

const logOut = () => {
  useUserStore().setEverythingToNull()
  router.push('/login')
}

const confirmLogout = () => {
  showLogoutDialog.value = true
}

const handleLogoutConfirm = () => {
  showLogoutDialog.value = false
  logOut()
}

const handleLogoutCancel = () => {
  showLogoutDialog.value = false
}

// Handle navigation clicks and update current section
const handleNavClick = (nav) => {
  // Update the current section
  currentSection.value = nav.name
  
  // Execute the navigation action
  if (nav.changeValue && typeof nav.changeValue === 'function') {
    nav.changeValue()
  }
}

// Handle mobile navigation clicks
const handleMobileNavClick = (nav) => {
  // Close the drawer first
  rightDrawerOpen.value = false
  
  // Then handle the navigation
  handleNavClick(nav)
}
</script>

<style scoped>
.navbar {
  background-color: white;
  height: auto;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.logo-container {
  display: flex;
  align-items: center;
  padding-left: 24px;
}

.logo {
  height: 36px;
  width: auto;
  margin-right: 12px;
}

.company-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;
  margin-right: 16px;
}

.nav-btn {
  color: #4b5563;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-transform: capitalize;
}

.nav-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.nav-btn.active {
  background-color: #dfdfe0;
  color: #111827;
  font-weight: 600;
}

/* Mobile Drawer */
.mobile-drawer {
  background-color: white;
}

.drawer-header {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  padding: 16px;
}

.drawer-item {
  color: #4b5563;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 4px 8px;
  transition: all 0.2s ease;
}

.drawer-item:hover {
  background-color: #f3f4f6;
}

.drawer-item.active {
  background-color: #f3f4f6;
  color: #111827;
  font-weight: 500;
}

.logout-card {
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
}

/* Tablet screens */
@media (max-width: 768px) {
  .logout-card {
    width: 95%;
    max-width: 400px;
  }
}

/* Mobile screens */
@media (max-width: 480px) {
  .logout-card {
    width: 100%;
    max-width: 95%;
    border-radius: 8px;
    padding: 16px !important;
  }

  .q-card-actions {
    justify-content: center;
    flex-direction: column;
  }

  .q-card-actions .q-btn {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
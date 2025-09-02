<template>
  <q-header class="bg-white text-dark navbar-custom">
    <q-toolbar class="q-gutter-md">
      <!-- 🔹 Brand Title -->
      <q-toolbar-title class="brand-title cursor-pointer" @click="$router.push('/')">
        TalentConnect<span class="brand-dot">:</span>
      </q-toolbar-title>

      <!-- 🔹 Centered Navigation (hidden on mobile and tablet) -->
      <q-space />
      <div class="row items-center q-gutter-lg nav-center gt-sm">
        <q-btn
          flat
          no-caps
          dense
          icon="home"
          label="Home"
          class="nav-btn"
          :class="{ active: isActiveRoute('/recruiter', true) }"
          @click="goToHome"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="work"
          label="Jobs Posted"
          class="nav-btn"
          :class="{ active: isActiveRoute('/recruiter/jobs-posted') }"
          @click="goToJobsPosted"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="add_box"
          label="Create Job"
          class="nav-btn"
          :class="{ active: isActiveRoute('/recruiter/create-job') }"
          @click="goToCreateJob"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="person"
          label="Edit Profile"
          class="nav-btn"
          :class="{ active: isActiveRoute('/recruiter/edit') }"
          @click="goToEditProfile"
        />
      </div>
      <q-space />

      <!-- 🔹 Mobile: Show hamburger menu (sm and below) -->
      <div class="lt-md mobile-menu-container">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="mobile-menu-btn"
          @click="showMobileMenu = true"
        />
      </div>

      <!-- 🔹 Desktop: Show avatar with simplified dropdown (md and up) -->
      <div class="row items-center q-gutter-sm gt-sm">
        <q-avatar
          size="48px"
          square
          color="grey-3"
          text-color="black"
          class="text-weight-bold"
          style="border-radius: 10px"
        >
          {{ getInitials(userStore.name) }}
        </q-avatar>

        <q-menu
          class="profile-dropdown"
          anchor="bottom right"
          self="top right"
          :offset="[0, 8]"
          content-class="custom-dropdown-content"
        >
          <div class="profile-header">
            <q-avatar
              size="48px"
              square
              color="grey-3"
              text-color="black"
              class="text-weight-bold"
              style="border-radius: 10px"
            >
              {{ getInitials(userStore.name) }}
            </q-avatar>

            <div class="profile-info">
              <div class="profile-name-full">
                {{ userStore.name || 'User Name' }}
              </div>
            </div>
          </div>

          <q-separator class="custom-separator" />

          <q-list class="menu-list" dense>
            <!-- 🔹 Only Logout Option for Desktop -->
            <q-item clickable v-ripple class="menu-item" @click="showLogoutConfirmation">
              <q-item-section avatar class="menu-icon-section">
                <q-icon name="logout" class="menu-icon" />
              </q-item-section>
              <q-item-section class="menu-text-section"> Log out </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-toolbar>

    <!-- 🔹 Mobile Fullscreen Menu -->
    <q-dialog
      v-model="showMobileMenu"
      maximized
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <div class="mobile-menu-container-full">
        <!-- Mobile Menu Header -->
        <div class="mobile-menu-header">
          <div class="mobile-user-info">
            <q-avatar
              size="40px"
              square
              color="grey-3"
              text-color="black"
              class="text-weight-bold"
              style="border-radius: 8px"
            >
              {{ getInitials(userStore.name) }}
            </q-avatar>
            <div class="mobile-user-name">
              {{ userStore.name || 'User Name' }}
            </div>
          </div>
          <q-btn
            flat
            dense
            round
            icon="close"
            class="mobile-close-btn"
            @click="showMobileMenu = false"
          />
        </div>

        <!-- Mobile Menu Content -->
        <div class="mobile-menu-content">
          <!-- Navigation Links -->
          <div class="mobile-nav-section">
            <q-btn
              flat
              no-caps
              class="mobile-nav-item"
              :class="{ active: isActiveRoute('/recruiter', true) }"
              @click="handleMobileNavClick(goToHome)"
            >
              <q-icon name="home" class="mobile-nav-icon" />
              <span class="mobile-nav-text">Home</span>
            </q-btn>

            <q-btn
              flat
              no-caps
              class="mobile-nav-item"
              :class="{ active: isActiveRoute('/recruiter/jobs-posted') }"
              @click="handleMobileNavClick(goToJobsPosted)"
            >
              <q-icon name="work" class="mobile-nav-icon" />
              <span class="mobile-nav-text">Jobs Posted</span>
            </q-btn>

            <q-btn
              flat
              no-caps
              class="mobile-nav-item"
              :class="{ active: isActiveRoute('/recruiter/create-job') }"
              @click="handleMobileNavClick(goToCreateJob)"
            >
              <q-icon name="add_box" class="mobile-nav-icon" />
              <span class="mobile-nav-text">Create Job</span>
            </q-btn>

            <q-btn
              flat
              no-caps
              class="mobile-nav-item"
              :class="{ active: isActiveRoute('/recruiter/edit') }"
              @click="handleMobileNavClick(goToEditProfile)"
            >
              <q-icon name="person" class="mobile-nav-icon" />
              <span class="mobile-nav-text">Edit Profile</span>
            </q-btn>
          </div>

          <!-- Logout Button -->
          <div class="mobile-logout-section">
            <q-btn no-caps class="mobile-logout-btn" @click="handleMobileNavClick(showLogoutConfirmation)">
              <q-icon name="logout" class="mobile-nav-icon" />
              <span class="mobile-nav-text">Log Out</span>
            </q-btn>
          </div>
        </div>
      </div>
    </q-dialog>
    
    <!-- 🔹 Logout Confirmation Dialog -->
    <q-dialog v-model="showLogoutDialog" persistent>
  <q-card class="q-pa-md" style="max-width: 400px; width: 90vw;">
    <q-card-section class="row items-center q-gutter-sm">
      <q-avatar icon="logout" color="primary" text-color="white" />
      <div class="text-h6">Confirm Logout</div>
    </q-card-section>

    <q-card-section class="q-pt-none text-body1">
      Are you sure you want to log out? You will be signed out of your account.
    </q-card-section>

    <q-card-actions align="right" class="q-pt-sm">
      <q-btn flat label="Cancel" color="grey-7" @click="showLogoutDialog = false" />
      <q-btn unelevated label="Logout" color="primary" @click="confirmLogout" />
    </q-card-actions>
  </q-card>
</q-dialog>
  </q-header>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from 'src/stores/user-store'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// Mobile menu state
const showMobileMenu = ref(false)
const showLogoutDialog = ref(false)
const isSaving = ref(false)

// Mobile menu navigation handler
const handleMobileNavClick = (navigationFunction) => {
  showMobileMenu.value = false
  navigationFunction()
}

// ✅ Active route checker with exact option
const isActiveRoute = (path, exact = false) => {
  if (exact) return route.path === path
  return route.path.startsWith(path)
}

// ✅ Recruiter navigation functions
const goToHome = () => router.push('/recruiter')
const goToJobsPosted = () => router.push('/recruiter/jobs-posted')
const goToCreateJob = () => router.push('/recruiter/create-job')
const goToEditProfile = () => router.push('/recruiter/edit')

// Initials
const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

// Show logout confirmation dialog
const showLogoutConfirmation = () => {
  showLogoutDialog.value = true
}

// Confirm logout and perform the actual logout
const confirmLogout = async () => {
  isSaving.value = true
  try {
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    userStore.setEverythingToNull()
    router.push('/')
  } finally {
    isSaving.value = false
    showLogoutDialog.value = false
  }
}
</script>

<style scoped>
/* 🔹 Navbar */
.navbar-custom {
  height: 70px;
  border-bottom: none;
  display: flex;
  align-items: center; /* ✅ vertical centering */
  padding: 0 16px; /* ✅ match main layout spacing */
  box-shadow: none;
}

/* Align brand title (stays fixed at original position) */
.navbar-custom {
  display: flex;
  align-items: center;
  margin-top: 0; /* ✅ keep title fixed */
  line-height: 1;
}

/* ✅ Push nav buttons, avatar & mobile menu down slightly */
.navbar-custom .nav-center,
.navbar-custom .q-avatar,
.navbar-custom .mobile-menu-container {
  margin-top: 2px; /* adjust value to taste */
}
.navbar-custom .row.items-center.q-gutter-sm.gt-sm .q-avatar {
  margin-top: 6px; /* adjust between 6–12px to taste */
}
.brand-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-top: 16px; /* keep natural positioning */
  margin-left: 12px;
}

.brand-dot {
  color: var(--q-primary);
  font-weight: bold;
}

.nav-btn {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease-in-out;
  padding: 10px 18px;
}

.nav-btn .q-icon {
  font-size: 22px;
}

.nav-btn:hover,
.nav-btn:focus,
.nav-btn.active {
  background-color: rgba(0, 119, 182, 0.1);
  border: 2px solid #0077b6;
  color: #0077b6 !important;
  box-shadow: 0 0 0 4px rgba(0, 119, 182, 0.1);
  border-radius: 8px;
}

.nav-center {
  justify-content: center;
}

.q-btn__content {
  gap: 6px;
}

/* Mobile Menu Button */
.mobile-menu-container {
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  font-size: 24px;
  color: #374151;
  background-color: transparent;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-menu-btn:hover {
  background-color: rgba(0, 119, 182, 0.1);
  color: #0077b6;
}

/* Mobile Menu Styles */
.mobile-menu-container-full {
  background: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-user-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-transform: capitalize;
}

.mobile-close-btn {
  font-size: 24px;
  color: #6b7280;
  background: transparent;
  padding: 8px;
  border-radius: 8px;
}

.mobile-close-btn:hover {
  background-color: rgba(0, 119, 182, 0.1);
  color: #0077b6;
}

.mobile-menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
}

.mobile-nav-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.mobile-nav-item {
  width: 100%;
  justify-content: flex-start;
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  background: transparent;
  border: none;
  border-radius: 12px;
  padding: 16px 20px;
  text-align: left;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
  background-color: rgba(0, 119, 182, 0.1);
  border: 2px solid #0077b6;
  color: #0077b6 !important;
  box-shadow: 0 0 0 4px rgba(0, 119, 182, 0.15);
}

.mobile-nav-icon {
  font-size: 24px;
  margin-right: 16px;
  color: #6b7280;
}

.mobile-nav-text {
  flex: 1;
  text-align: left;
}

.mobile-logout-section {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.mobile-logout-btn {
  width: 100%;
  justify-content: flex-start;
  font-size: 18px;
  font-weight: 500;
  color: var(--q-primary);
  background: transparent;
  border: none;
  border-radius: 12px;
  padding: 16px 20px;
  text-align: left;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.mobile-logout-btn:hover {
  background-color: rgba(0, 119, 182, 0.1);
}

.mobile-logout-btn .mobile-nav-icon {
  color: var(--q-primary);
}


/* 🔹 Simplified Desktop Profile Dropdown */
.profile-dropdown {
  min-width: 300px;
  max-width: 400px;
  width: max-content;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 119, 182, 0.12);
  background: #fff;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
}

.profile-avatar {
  border: 1px solid #e5e7eb;
}

.profile-info {
  flex: 1;
}

.profile-name-full {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.4;
  white-space: nowrap;
}

.menu-list {
  padding: 10px 0;
  background: #fff;
}

.menu-item {
  padding: 15px 22px;
  font-size: 15px;
  font-weight: 400;
  color: #374151;
  font-family: '-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-color 0.2s ease;
  background: #fff;
  border-radius: 0;
  margin: 0;
}

.menu-item:hover {
  background-color: rgba(0, 119, 182, 0.1)!important;
}

.menu-icon-section {
  min-width: 36px;
  margin-right: 8px;
}

.menu-icon {
  font-size: 20px;
  color: #6b7280;
}

.menu-text-section {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Responsive breakpoints */
@media (max-width: 1023px) {
  .navbar-custom .q-toolbar {
    padding: 0 16px;
  }
}
</style>
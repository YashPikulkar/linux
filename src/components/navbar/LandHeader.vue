<template>
  <q-header class="custom-header">
    <q-toolbar class="header-toolbar">
      <!-- Logo/Brand -->
      <q-toolbar-title class="brand-title" @click="goToLanding" style="cursor: pointer">
        TalentConnect<span class="brand-dot">:</span>
      </q-toolbar-title>

      <!-- Desktop Navigation Menu (Hidden on mobile) -->
      <div class="nav-links q-gutter-lg gt-sm">
        <q-btn
          flat
          no-caps
          class="nav-btn"
          :class="{ active: isActiveRoute('discover') }"
          @click="goToDiscover"
        >
          Discover
        </q-btn>

        <q-btn
          flat
          no-caps
          class="nav-btn"
          :class="{ active: isActiveRoute('/all-jobs') }"
          @click="goToJobs"
        >
          For job seekers
        </q-btn>

        <q-btn
          flat
          no-caps
          class="nav-btn"
          :class="{ active: isActiveRoute('/special-feature') }"
          @click="goToRecruiterFeature"
        >
          For companies
        </q-btn>
      </div>

      <q-space />

      <!-- Desktop Auth Buttons -->
      <div v-if="!userStore.isLoggedIn" class="auth-buttons q-gutter-sm gt-sm">
        <q-btn no-caps class="custom-login-btn" @click="goToLogin"> Log In </q-btn>
        <q-btn no-caps class="custom-signup-btn" @click="goToRegister"> Sign Up </q-btn>
      </div>

      <!-- Mobile Hamburger Menu -->
      <div v-if="!userStore.isLoggedIn" class="lt-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="mobile-menu-btn"
          @click="showMobileMenu = true"
        />
      </div>

      <!-- Desktop Avatar Menu -->
      <div v-if="userStore.isLoggedIn" class="row items-center q-gutter-sm">
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
              <div class="profile-name">
                {{ userStore.name || 'User Name' }}
              </div>
            </div>
          </div>

          <q-separator class="custom-separator" />

          <q-list class="menu-list" dense>
            <!-- Applicant Menu -->
            <template v-if="userStore.role === 'applicant'">
              <q-item clickable v-ripple class="menu-item" @click="goToEditProfile">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="person" class="menu-icon" />
                </q-item-section>
                <q-item-section class="menu-text-section">Edit profile</q-item-section>
              </q-item>

              <q-item clickable v-ripple class="menu-item" @click="goToApplicationStatus">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="assignment" class="menu-icon" />
                </q-item-section>
                <q-item-section class="menu-text-section">Application status</q-item-section>
              </q-item>

              <q-item clickable v-ripple class="menu-item" @click="goToUpdateResume">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="description" class="menu-icon" />
                </q-item-section>
                <q-item-section class="menu-text-section">Update resume</q-item-section>
              </q-item>

              <q-item clickable v-ripple class="menu-item" @click="goToAnalytics">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="analytics" class="menu-icon" />
                </q-item-section>
                <q-item-section class="menu-text-section">Analytics</q-item-section>
              </q-item>
            </template>

            <!-- Recruiter Menu -->
            <template v-else-if="userStore.role === 'recruiter'">
              <div class="menu-section-title">Company</div>
              <q-item clickable v-ripple class="menu-item" @click="goToAnalytics">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="analytics" class="menu-icon" />
                </q-item-section>
                <q-item-section class="menu-text-section">Analytics</q-item-section>
              </q-item>

              <q-item clickable v-ripple class="menu-item" @click="goToEditCompanyProfile">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="business" class="menu-icon" />
                </q-item-section>
                <q-item-section class="menu-text-section">Edit company profile</q-item-section>
              </q-item>

              <q-item clickable v-ripple class="menu-item" @click="goToJobsPosted">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="work" class="menu-icon" />
                </q-item-section>
                <q-item-section class="menu-text-section">Jobs posted</q-item-section>
              </q-item>
            </template>

            <!-- Logout -->
            <q-item clickable v-ripple class="menu-item" @click="handleLogout">
              <q-item-section avatar class="menu-icon-section">
                <q-icon name="logout" class="menu-icon" />
              </q-item-section>
              <q-item-section class="menu-text-section">Log out</q-item-section>
            </q-item>
          </q-list>

          <!-- Post Job for Recruiters -->
          <div v-if="userStore.role === 'recruiter'" class="post-job-section">
            <q-separator class="custom-separator" />
            <q-btn class="post-job-btn" color="primary" no-caps @click="goToPostJob">
              POST A JOB
            </q-btn>
          </div>
        </q-menu>
      </div>
    </q-toolbar>

    <!-- Mobile Fullscreen Menu -->
    <q-dialog
      v-model="showMobileMenu"
      maximized
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <div class="mobile-menu-container">
        <div class="mobile-menu-header">
          <div class="mobile-brand-title">TalentConnect<span class="brand-dot">:</span></div>
          <q-btn
            flat
            dense
            round
            icon="close"
            class="mobile-close-btn"
            @click="showMobileMenu = false"
          />
        </div>

        <div class="mobile-menu-content">
          <div class="mobile-nav-section">
            <q-btn flat no-caps class="mobile-nav-item" @click="handleMobileNavClick(goToDiscover)">
              Discover
            </q-btn>

            <q-btn flat no-caps class="mobile-nav-item" @click="handleMobileNavClick(goToJobs)">
              For job seekers
            </q-btn>

            <q-btn
              flat
              no-caps
              class="mobile-nav-item"
              @click="handleMobileNavClick(goToRecruiterFeature)"
            >
              For companies
            </q-btn>
          </div>

          <div class="mobile-auth-section">
            <q-btn no-caps class="mobile-login-btn" @click="handleMobileNavClick(goToLogin)">
              Log In
            </q-btn>

            <q-btn
              no-caps
              class="mobile-signup-btn-jobseeker"
              @click="handleMobileNavClick(goToRegister)"
            >
              Sign Up
            </q-btn>
          </div>
        </div>
      </div>
    </q-dialog>
  </q-header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const showMobileMenu = ref(false)

const handleMobileNavClick = (navigationFunction, role = null) => {
  showMobileMenu.value = false
  if (role) router.push({ path: '/register', query: { role } })
  else navigationFunction()
}

// Navigation functions
const goToLogin = () => router.push('/login')
const goToRegister = () => router.push('/register')
const goToDiscover = () => router.push('/')
const goToLanding = () => router.push('/')
const goToRecruiterFeature = () =>
  router.push(userStore.role === 'recruiter' ? '/recruiter/special-feature' : '/special-feature')
const goToJobs = () => router.push('/all-jobs')
const goToEditProfile = () => router.push('/applicant/edit-applicant')
const goToApplicationStatus = () => router.push('/applicant/application-status')
const goToUpdateResume = () => router.push('/applicant/resumes')
const goToAnalytics = () =>
  router.push(userStore.role === 'applicant' ? '/applicant' : '/recruiter')
const goToEditCompanyProfile = () => router.push('/recruiter/edit')
const goToJobsPosted = () => router.push('/recruiter/jobs-posted')
const goToPostJob = () => router.push('/recruiter/create-job')

const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

const isActiveRoute = (path) => route.path.startsWith(path)
const handleLogout = () => {
  userStore.setEverythingToNull()
  router.push('/')
}
</script>
<style scoped>
:root {
  --copper: #b87333;
  --copper-dark: #a85f29; /* darker copper tone for hover */
}

/* =========================
     Profile Dropdown
  ========================= */
.profile-dropdown {
  width: 360px;
  border-radius: 99px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: #fff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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

.profile-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.4;
}

.menu-list {
  padding: 10px 0;
  background: #fff;
}

.menu-section-title {
  padding: 12px 22px 6px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.2px;
  background: #fff;
}

.menu-item {
  padding: 15px 22px;
  font-size: 15px;
  font-weight: 400;
  color: #374151;
  transition: background-color 0.2s ease, color 0.2s ease;
  background: #fff;
  border-radius: 8px;
}

.menu-item:hover {
  background-color: rgba(184, 115, 51, 0.1) !important;
  color: var(--copper);
}

/* =========================
     Post Job Button
  ========================= */
.post-job-section {
  padding: 18px 20px;
  background: #fff;
}

.post-job-btn {
  width: 100%;
  background: #f9fafb;
  font-weight: 600;
  font-size: 14px;
  color: var(--copper);
  border-radius: 8px;
  padding: 14px;
}

.post-job-btn:hover {
  background: rgba(184, 115, 51, 0.1);
}

/* =========================
     Header
  ========================= */
.custom-header {
  background-color: #ffffff;
  color: #1f2937;
  box-shadow: none;
  border-bottom: none;
}

.header-toolbar {
  padding: 0 24px;
  min-height: 70px;
  display: flex;
  align-items: center;
}

.brand-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.brand-text {
  color: #1f2937;
}

.brand-dot {
  color: var(--copper);
  font-weight: bold;
}

.nav-links {
  display: flex;
  align-items: center;
  margin-left: 48px;
}

/* =========================
     Desktop Nav Buttons
  ========================= */
.nav-btn {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  background-color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 8px 18px;
  transition: background 0.25s ease, color 0.25s ease, border 0.25s ease, box-shadow 0.25s ease;
}

.nav-btn:hover,
.nav-btn:focus,
.nav-btn.active {
  background-color: rgba(184, 115, 51, 0.1);
  border: 2px solid var(--copper);
  color: var(--copper);
  box-shadow: 0 0 0 4px rgba(184, 115, 51, 0.15);
}

/* =========================
     Auth Buttons (Desktop)
  ========================= */
.custom-login-btn {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  background-color: #ffffff;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  padding: 8px 24px;
  transition: all 0.25s ease;
  min-width: 110px;
}

.custom-login-btn:hover,
.custom-login-btn:focus,
.custom-login-btn:active {
  background-color: rgba(184, 115, 51, 0.1);
  border-color: var(--copper);
  color: var(--copper);
  box-shadow: 0 0 0 4px rgba(184, 115, 51, 0.15);
}

.custom-signup-btn {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  background-color: #111827;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 8px 24px;
  transition: all 0.25s ease;
  min-width: 110px;
}

.custom-signup-btn:hover,
.custom-signup-btn:focus,
.custom-signup-btn:active {
  background-color: var(--copper);
  color: #ffffff;
  border: 2px solid var(--copper);
  box-shadow: 0 0 0 4px rgba(184, 115, 51, 0.2);
}

/* =========================
     Mobile Menu
  ========================= */
.mobile-menu-btn {
  font-size: 24px;
  color: #111827;
  background-color: transparent;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-menu-btn:hover {
  background-color: rgba(184, 115, 51, 0.1);
  color: var(--copper);
}

.mobile-menu-container {
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

.mobile-brand-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.mobile-close-btn {
  font-size: 24px;
  color: #6b7280;
  background: transparent;
  padding: 8px;
  border-radius: 8px;
}

.mobile-close-btn:hover {
  background-color: rgba(184, 115, 51, 0.2);
  color: var(--copper);
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
  margin-bottom: 48px;
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
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
  background-color: rgba(184, 115, 51, 0.1);
  color: var(--copper);
  border: 2px solid var(--copper);
  box-shadow: 0 0 0 4px rgba(184, 115, 51, 0.15);
}

/* =========================
     Mobile Auth Buttons
  ========================= */
.mobile-auth-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: auto;
}

.mobile-login-btn {
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  color: #111827;
  background-color: #ffffff;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  padding: 16px 24px;
  transition: all 0.25s ease;
}

.mobile-login-btn:hover {
  background-color: #f9fafb;
  border-color: var(--copper);
}

.mobile-signup-btn-jobseeker {
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  background-color: #111827;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px 24px;
  transition: all 0.25s ease;
}

.mobile-signup-btn-jobseeker:hover {
  background-color: var(--copper);
  border-color: var(--copper);
}

.mobile-signup-btn-company {
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  background-color: var(--copper);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px 24px;
  transition: all 0.25s ease;
}

.mobile-signup-btn-company:hover {
  background-color: var(--copper-dark);
  border-color: var(--copper-dark);
}

/* =========================
     Responsive
  ========================= */
@media (max-width: 1023px) {
  .header-toolbar {
    padding: 0 16px;
  }

  .brand-title {
    font-size: 20px;
  }
}

</style>

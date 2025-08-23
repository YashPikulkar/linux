<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- Header -->
    <q-header class="custom-header">
      <q-toolbar class="header-toolbar">
        <!-- Logo/Brand -->
        <q-toolbar-title class="brand-title" @click="goToLanding" style="cursor: pointer">
          TalentConnect<span class="brand-dot">:</span>
        </q-toolbar-title>

        <!-- Navigation Menu -->
        <div class="nav-links q-gutter-lg">
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

        <!-- 🔹 Show auth buttons if NOT logged in -->
        <div v-if="!userStore.isLoggedIn" class="auth-buttons q-gutter-sm">
          <q-btn no-caps class="custom-login-btn" @click="goToLogin"> Log In </q-btn>
          <q-btn no-caps class="custom-signup-btn" @click="goToRegister"> Sign Up </q-btn>
        </div>

        <!-- 🔹 Show avatar if logged in -->
        <div v-else class="row items-center q-gutter-sm">
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
                <div
                  style="
                    font-size: 20px; /* slightly smaller than 16px in your code */
                    font-weight: 400; /* medium-bold look */
                    color: #0f172a; /* modern dark navy */
                    font-family:
                      Inter,
                      -apple-system,
                      BlinkMacSystemFont,
                      'Segoe UI',
                      Roboto,
                      sans-serif;
                    line-height: 1.4; /* keeps the text balanced vertically */
                    white-space: nowrap; /* single line */
                    overflow: hidden; /* prevents overflow */
                    text-overflow: ellipsis; /* adds ... if too long */
                    text-transform: capitalize; /* ensures first letters after space are uppercase */
                  "
                >
                  {{ userStore.name || 'User Name' }}
                </div>
              </div>
            </div>

            <q-separator class="custom-separator" />

            <q-list class="menu-list" dense>
              <!-- Applicant Menu Options -->
              <template v-if="userStore.role === 'applicant'">
                <q-item clickable v-ripple class="menu-item" @click="goToEditProfile">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="person" class="menu-icon" />
                  </q-item-section>
                  <q-item-section
                    class="menu-text-section"
                    :style="{
                      fontFamily: 'Inter, Arial, sans-serif',
                      fontWeight: '500',
                      fontSize: '16px',
                    }"
                    >Edit profile</q-item-section
                  >
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="goToApplicationStatus">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="assignment" class="menu-icon" />
                  </q-item-section>
                  <q-item-section
                    class="menu-text-section"
                    :style="{
                      fontFamily: 'Inter, Arial, sans-serif',
                      fontWeight: '500',
                      fontSize: '16px',
                    }"
                    >Application status</q-item-section
                  >
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="goToUpdateResume">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="description" class="menu-icon" />
                  </q-item-section>
                  <q-item-section
                    class="menu-text-section"
                    :style="{
                      fontFamily: 'Inter, Arial, sans-serif',
                      fontWeight: '500',
                      fontSize: '16px',
                    }"
                    >Update resume</q-item-section
                  >
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="goToAnalytics">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="analytics" class="menu-icon" />
                  </q-item-section>
                  <q-item-section
                    class="menu-text-section"
                    :style="{
                      fontFamily: 'Inter, Arial, sans-serif',
                      fontWeight: '500',
                      fontSize: '16px',
                    }"
                    >Analytics</q-item-section
                  >
                </q-item>
              </template>

              <!-- Recruiter Menu Options -->
              <template v-else-if="userStore.role === 'recruiter'">
                <div class="menu-section-title">Company</div>
                <q-item clickable v-ripple class="menu-item" @click="goToAnalytics">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="analytics" class="menu-icon" />
                  </q-item-section>
                  <q-item-section
                    class="menu-text-section"
                    :style="{
                      fontFamily: 'Inter, Arial, sans-serif',
                      fontWeight: '500',
                      fontSize: '16px',
                    }"
                    >Analytics</q-item-section
                  >
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="goToEditCompanyProfile">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="business" class="menu-icon" />
                  </q-item-section>
                  <q-item-section
                    class="menu-text-section"
                    :style="{
                      fontFamily: 'Inter, Arial, sans-serif',
                      fontWeight: '500',
                      fontSize: '16px',
                    }"
                    >Edit company profile</q-item-section
                  >
                </q-item>

                <q-item clickable v-ripple class="menu-item" @click="goToJobsPosted">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="work" class="menu-icon" />
                  </q-item-section>
                  <q-item-section
                    class="menu-text-section"
                    :style="{
                      fontFamily: 'Inter, Arial, sans-serif',
                      fontWeight: '500',
                      fontSize: '16px',
                    }"
                    >Jobs posted</q-item-section
                  >
                </q-item>
              </template>

              <q-item clickable v-ripple class="menu-item" @click="handleLogout">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="logout" class="menu-icon" />
                </q-item-section>
                <q-item-section
                  class="menu-text-section"
                  :style="{
                    fontFamily: 'Inter, Arial, sans-serif',
                    fontWeight: '500',
                    fontSize: '16px',
                  }"
                  >Log out</q-item-section
                >
              </q-item>
            </q-list>

            <!-- Post a Job Button for Recruiters -->
            <div v-if="userStore.role === 'recruiter'" class="post-job-section">
              <q-separator class="custom-separator" />
              <q-btn class="post-job-btn" color="primary" no-caps @click="goToPostJob">
                POST A JOB
              </q-btn>
            </div>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 🔹 General Navigation
const goToLogin = () => router.push('/login')
const goToRegister = () => router.push('/register')
const goToDiscover = () => router.push('/') // Home page
// 🔹 Logo / Landing Page Navigation
const goToLanding = () => router.push('/')

// 🔹 Recruiter Feature Navigation
const goToRecruiterFeature = () => {
  if (userStore.role === 'recruiter') router.push('/recruiter/special-feature')
  else router.push('/special-feature') // public/global page
}

// 🔹 Jobs Navigation (role-specific)
const goToJobs = () => {
  if (userStore.role === 'applicant') router.push('/applicant/all-jobs')
  else router.push('/all-jobs') // global jobs page
}
const getInitials = (name) => {
  if (!name) return 'U' // fallback if no name
  const parts = name.trim().split(' ')
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

// 🔹 Applicant-specific Navigation
const goToEditProfile = () => router.push('/applicant/edit-applicant')
const goToApplicationStatus = () => router.push('/applicant/application-status')
const goToUpdateResume = () => router.push('/applicant/resumes')

// Note: Add analytics route if you create them
const goToAnalytics = () => {
  if (userStore.role === 'applicant') router.push('/applicant')
  else if (userStore.role === 'recruiter') router.push('/recruiter')
}

// 🔹 Recruiter-specific Navigation
const goToEditCompanyProfile = () => router.push('/recruiter/edit')
const goToJobsPosted = () => router.push('/recruiter/jobs-posted')
const goToPostJob = () => router.push('/recruiter/create-job')

// 🔹 Check if current route matches (for active link highlighting)
const isActiveRoute = (path) => route.path.startsWith(path)

// 🔹 Logout
const handleLogout = () => {
  userStore.setEverythingToNull() // clear all user info including role
  router.push('/login')
}

// 🔹 Optional: Route Guard Logic (for role-based protection)
router.beforeEach((to, from, next) => {
  const role = userStore.role
  if (to.path.startsWith('/applicant') && role !== 'applicant') return next('/login')
  if (to.path.startsWith('/recruiter') && role !== 'recruiter') return next('/login')
  next()
})
</script>

<style scoped>
.profile-dropdown {
  width: 360px;
  border-radius: 99px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  letter-spacing: 0.2px;
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
  background-color: #f9fafb !important;
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

.post-job-section {
  padding: 18px 20px;
  background: #fff;
}

.post-job-btn {
  width: 100%;
  background: #f9fafb;
  font-weight: 600;
  font-size: 14px;
  color: #3b82f6;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 14px;
}

.post-job-btn:hover {
  background: #eef2ff;
}

.main-layout {
  background-color: #f9fafb;
}

.custom-header {
  background-color: #ffffff;
  color: #1f2937;
  box-shadow: none;
  border-bottom: none;
}

.header-toolbar {
  padding: 0 24px;
  min-height: 80px;
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
  color: #ef4444;
  font-weight: bold;
}

.nav-links {
  display: flex;
  align-items: center;
  margin-left: 48px;
}

.nav-btn {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  background-color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 8px 18px;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border 0.25s ease,
    box-shadow 0.25s ease;
}

.nav-btn:hover,
.nav-btn:focus {
  background-color: #fdecea;
  border: 2px solid #ef4444;
  color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

.nav-btn.active {
  background-color: #fdecea;
  border: 2px solid #ef4444;
  color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

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
  background-color: #fdecea;
  border-color: #ef4444;
  color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
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
  background-color: #ef4444;
  color: #ffffff;
  border: 2px solid #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
}
</style>

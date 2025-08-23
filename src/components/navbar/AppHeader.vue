<template>
  <q-header class="bg-white text-dark navbar-custom">
    <q-toolbar class="q-gutter-md">
      <!-- 🔹 Centered Navigation (hidden on mobile and tablet) -->
      <q-space />
      <div class="row items-center q-gutter-lg nav-center gt-sm">
        <q-btn
          flat
          no-caps
          dense
          icon="home"
          label="Home"
          @click="$router.push('/applicant')"
          class="nav-btn"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="dashboard"
          label="Application Status"
          @click="$router.push('/applicant/application-status')"
          class="nav-btn"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="description"
          label="Resumes"
          @click="$router.push('/applicant/resumes')"
          class="nav-btn"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="person"
          label="Edit Profile"
          @click="$router.push('/applicant/edit-applicant')"
          class="nav-btn"
        />
      </div>
      <q-space />

      <!-- 🔹 Mobile: Show name and avatar -->
      <div class="row items-center q-gutter-sm">
        <!-- Name (only on mobile and tablet) -->

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
</template>

<script setup>
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

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

// 🔹 Logout
const handleLogout = () => {
  userStore.setEverythingToNull() // clear all user info including role
  router.push('/')
}
</script>

<style scoped>
/* 🔹 Navbar */
.navbar-custom {
  height: 70px;
  border-bottom: none;
  display: flex;
  align-items: center;
  padding-top: 5px;
  box-shadow: none;
}

/* 🔹 Navigation Buttons */
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

.nav-btn .q-icon {
  font-size: 20px;
}

/* Hover + Active (same effect as your other header) */
.nav-btn:hover,
.nav-btn:focus,
.nav-btn.active {
  background-color: #fdecea;
  border: 2px solid #ef4444;
  color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

/* 🔹 Dropdown trigger (the avatar container) */
.row.items-center.q-gutter-sm {
  padding: 6px 10px;
  border-radius: 12px;
  transition:
    background 0.25s ease,
    border 0.25s ease,
    box-shadow 0.25s ease;
}

/* Same hover/active effect for dropdown container */
.row.items-center.q-gutter-sm:hover,
.row.items-center.q-gutter-sm:focus {
  background-color: #fdecea;
  border: 2px solid #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

.nav-center {
  justify-content: center;
}

.q-btn__content {
  gap: 6px;
}

/* 🔹 Mobile name styling */
.mobile-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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
  font-family: -apple-system, BlinkMacSystemFont, 'Segue UI', Roboto, sans-serif;
  padding: 14px;
}
</style>

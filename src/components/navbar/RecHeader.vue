<template>
  <q-header class="bg-white text-dark navbar-custom">
    <q-toolbar class="q-gutter-md">
      <!-- 🔹 Centered Navigation -->
      <q-space />
      <div class="row items-center q-gutter-lg nav-center">
        <q-btn
          flat
          no-caps
          dense
          icon="home"
          label="Home"
          @click="$router.push('/recruiter')"
          class="nav-btn"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="work"
          label="Jobs Posted"
          @click="$router.push('/recruiter/jobs-posted')"
          class="nav-btn"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="add_box"
          label="Create Job"
          @click="$router.push('/recruiter/create-job')"
          class="nav-btn"
        />
        <q-btn
          flat
          no-caps
          dense
          icon="person"
          label="Edit Profile"
          @click="$router.push('/recruiter/edit')"
          class="nav-btn"
        />
      </div>
      <q-space />

      <!-- 🔹 Avatar + Dropdown Menu -->
      <div class="row items-center q-gutter-sm">
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

// Note: Add analytics route if you create them
const goToAnalytics = () => {
  if (userStore.role === 'applicant') router.push('/applicant')
  else if (userStore.role === 'recruiter') router.push('/recruiter')
}

// 🔹 Recruiter-specific Navigation
const goToEditCompanyProfile = () => router.push('/recruiter/edit')
const goToJobsPosted = () => router.push('/recruiter/jobs-posted')
const goToPostJob = () => router.push('/recruiter/create-job')

// 🔹 Logout
const handleLogout = () => {
  userStore.setEverythingToNull() // clear all user info including role
  router.push('/')
}
</script>

<style scoped>
/* 🔹 Navbar */
.nav-btn {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  transition: all 0.25s ease-in-out;
  padding: 10px 18px;
  border-radius: 8px;
}

.nav-btn .q-icon {
  font-size: 22px;
  transition: color 0.25s ease-in-out;
}

/* Hover effect - copper accent */
.nav-btn:hover {
  color: #b87333; /* copper text */
  background-color: rgba(184, 115, 51, 0.08); /* subtle copper tint */
}

/* Profile dropdown items */
.menu-item {
  padding: 15px 22px;
  font-size: 15px;
  font-weight: 400;
  color: #374151;
  background: #fff;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 0 6px;
}

/* Copper hover for dropdown items */
.menu-item:hover {
  background-color: rgba(184, 115, 51, 0.08) !important;
  color: #b87333;
}

.menu-icon {
  font-size: 20px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.menu-item:hover .menu-icon {
  color: #b87333;
}

/* Post Job button with stronger copper call-to-action */
.post-job-btn {
  width: 100%;
  background: #f9fafb;
  font-weight: 600;
  font-size: 14px;
  color: #b87333;
  border: 2px solid #b87333;
  border-radius: 8px;
  padding: 14px;
  transition: all 0.25s ease-in-out;
}

.post-job-btn:hover {
  background: #b87333;
  color: #fff;
}
.post-job-btn:focus {
  outline: 2px solid #8a5525;
  outline-offset: 2px;
}
</style>

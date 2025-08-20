<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- 🔹 Navbar -->
    <q-header elevated class="bg-white text-dark shadow-sm navbar-custom">
      <q-toolbar class="q-gutter-md">
        <!-- 🔹 Centered Navigation -->
        <q-space />
        <!-- pushes to center -->
        <div class="row items-center q-gutter-lg nav-center">
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
          <q-btn
            flat
            no-caps
            dense
            icon="star"
            label="Special Feature"
            @click="$router.push('/applicant/special-feature')"
            class="nav-btn"
          />
        </div>
        <q-space />
        <!-- pushes to center -->

        <!-- 🔹 Logout on Right -->
        <q-btn flat round dense icon="logout" color="primary" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <!-- 🔹 Main Content -->
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row">
          <!-- Left Card -->
          <div class="col-12 col-md-2">
            <div class="full-height left-card-wrapper">
              <LeftCard />
            </div>
          </div>

          <!-- Right Card -->
          <div class="col-12 col-md-10">
            <div class="full-height right-card-wrapper">
              <q-card class="modern-right-card" flat bordered>
                <router-view />
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import LeftCard from 'src/components/user/LeftCard.vue'
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
  userStore.setEverythingToNull
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  background-color: #f9fafb;
}

/* 🔹 Navbar */
/* 🔹 Navbar */
.navbar-custom {
  height: 75px; /* ⬆️ taller header */
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center; /* vertically center everything */
  padding-top: 5px; /* push content slightly down */
}

/* 🔹 Nav Buttons Bigger */
.nav-btn {
  font-size: 16px; /* ⬆️ bigger text */
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease-in-out;
  padding: 10px 18px; /* ⬆️ bigger clickable area */
}

.nav-btn .q-icon {
  font-size: 22px; /* ⬆️ bigger icons */
}

.nav-btn:hover {
  color: #1d4ed8;
}

.nav-center {
  justify-content: center;
}

.q-btn__content {
  gap: 6px; /* spacing between icon & text */
}

.full-height {
  height: 100%;
}

/* 🔹 Keep left card fixed under header */
.left-card-wrapper {
  position: sticky;
  top: 70px; /* header height */
  height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: start;
  padding-top: 15px;
}

/* 🔹 Right card container */
.right-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
}

/* 🔹 Modern Right Card */
.modern-right-card {
  height: 80vh;
  width: 100%;
  border-radius: 16px;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modern-right-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-2px);
  border-color: rgba(0, 0, 0, 0.08) !important;
}

/* 🔹 Responsiveness */
@media (max-width: 599px) {
  .modern-right-card {
    height: 70vh;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .modern-right-card {
    height: 75vh;
  }
}

@media (min-width: 1024px) {
  .modern-right-card {
    height: 85vh;
  }
}
</style>

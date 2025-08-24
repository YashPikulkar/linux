<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- 🔹 Recruiter Navbar -->
    <q-header elevated class="bg-white text-dark shadow-sm navbar-custom">
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

        <!-- 🔹 Logout on Right -->
        <q-btn flat round dense icon="logout" color="primary" @click="confirmLogout" />
      </q-toolbar>
    </q-header>

    <!-- Logout Confirmation Dialog -->
    <q-dialog v-model="showLogoutDialog" persistent>
      <q-card class="logout-card q-pa-lg">
        <!-- Header -->
        <q-card-section class="row items-center q-pb-md">
          <q-icon name="logout" color="primary" size="48px" class="q-mr-md" />
          <div class="text-h6 text-weight-medium">Confirm Logout</div>
        </q-card-section>

        <!-- Message -->
        <q-card-section class="q-pt-none text-body1 text-grey-8">
          Are you sure you want to log out of your account? Any unsaved changes will be lost.
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat label="Cancel" color="primary" @click="handleLogoutCancel" />
          <q-btn unelevated label="Log out" color="primary" @click="handleLogoutConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LeftCard from 'src/components/user/LeftCard.vue'
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()
const router = useRouter()
const showLogoutDialog = ref(false)

function logOut() {
  userStore.setEverythingToNull()
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
</script>

<style scoped>
.main-layout {
  background-color: #f9fafb;
}

/* 🔹 Navbar */
.navbar-custom {
  height: 75px; /* ⬆️ bigger height */
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center; /* vertically center */
  padding-top: 5px; /* push a bit lower */
}

.nav-btn {
  font-size: 16px; /* ⬆️ bigger text */
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease-in-out;
  padding: 10px 18px; /* bigger clickable area */
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

.left-card-wrapper {
  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: start;
  padding-top: 15px;
}

.right-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
}

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

.modern-right-card::-webkit-scrollbar {
  display: none;
}

.modern-right-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-2px);
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.logout-card {
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
}

@media (max-width: 599px) {
  .modern-right-card {
    height: 70vh;
  }
  
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

@media (min-width: 600px) and (max-width: 1023px) {
  .modern-right-card {
    height: 75vh;
  }
  
  .logout-card {
    width: 95%;
    max-width: 400px;
  }
}

@media (min-width: 1024px) {
  .modern-right-card {
    height: 85vh;
  }
}
</style>
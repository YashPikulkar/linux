<template>
  <div class="dashboard-wrapper">
    <!-- Navigation Bar -->
    <div class="user-dashboard-nav">
      <div class="nav-icon-btn" @click="setActive('Overview')">
        <q-icon name="dashboard" size="24px" />
        <div class="label">Overview</div>
      </div>

      <div class="nav-icon-btn" @click="setActive('Jobs')">
        <q-icon name="add_box" size="24px" />
        <div class="label">Post a Job</div>
      </div>

      <div class="nav-icon-btn" @click="setActive('Applicants')">
        <q-icon name="people" size="24px" />
        <div class="label">Applicants</div>
      </div>

      <div class="nav-icon-btn" @click="setActive('Notifications')">
        <q-icon name="notifications" size="24px" />
        <div class="label">Notifications</div>
      </div>

      <!-- Avatar Dropdown -->
      <q-btn round flat dense class="avatar-btn">
        <q-avatar size="36px" class="user-avatar">
          <img src="https://cdn.quasar.dev/img/avatar.png" alt="User Avatar" />
        </q-avatar>

        <q-menu v-model="menuVisible" class="user-menu">
          <q-list class="menu-list">

            <q-item-label header class="menu-header">Quick Actions</q-item-label>

            <q-item clickable v-ripple @click="setActive('Jobs')" class="menu-item">
              <q-item-section avatar><q-icon name="add" /></q-item-section>
              <q-item-section>Create Job Post</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="setActive('Applicants')" class="menu-item">
              <q-item-section avatar><q-icon name="people" /></q-item-section>
              <q-item-section>Manage Candidates</q-item-section>
            </q-item>


            <q-separator />

            <q-item-label header class="menu-header">Panel</q-item-label>

            <q-item clickable v-ripple @click="setActive('CompanyProfile')" class="menu-item">
              <q-item-section avatar><q-icon name="business" /></q-item-section>
              <q-item-section>Company Profile</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="setActive('Job_posted')" class="menu-item">
              <q-item-section avatar><q-icon name="work_outline" /></q-item-section>
              <q-item-section>Manage Jobs</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="setActive('Settings')" class="menu-item">
              <q-item-section avatar><q-icon name="settings" /></q-item-section>
              <q-item-section>Settings</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple @click="handleLogout" class="menu-item logout-item">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Modal Overlay -->
    <div
      v-show="activeView !== 'Overview'"
      class="modal-overlay"
      @click="closeModal"
      :class="{ 'modal-entering': isEntering, 'modal-exiting': isExiting }"
    >
      <div
        class="modal-window"
        @click.stop
        :class="{ 'window-entering': isEntering, 'window-exiting': isExiting }"
      >
        <div class="modal-header">
          <h3 class="modal-title">{{ activeView }}</h3>
          <q-btn round flat dense icon="close" class="close-btn" @click="closeModal" />
        </div>

        <div class="modal-content">
          <!-- Dynamically load view components -->
          <component :is="activeComponent" v-if="activeComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

// Import dashboard components
import DashboardJobs from 'src/components/RecruiterDashboard/Features/postjob.vue'
import DashboardNotifications from 'src/components/UserDashboard/notification/DashboardNotification.vue'
import ApplicantList from 'src/components/RecruiterDashboard/ApplicantList.vue'
import CompanyProfile from 'src/components/RecruiterDashboard/Features/companyprofile.vue'
import UserSettings from 'src/components/RecruiterDashboard/settings/settings.vue'

// State
const activeView = ref('Overview')
const isEntering = ref(false)
const isExiting = ref(false)
const menuVisible = ref(false)

const $q = useQuasar()
const router = useRouter()

// Logout Confirmation Dialog
function handleLogout() {
  menuVisible.value = false
  $q.dialog({
    title: 'Confirm Logout',
    message: 'Are you sure you want to log out?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    console.log('User confirmed logout')
    router.push('/')
  }).onCancel(() => {
    console.log('Logout cancelled')
  })
}

// View switcher with animation
function setActive(view) {
  if (view === 'Overview') {
    if (activeView.value !== 'Overview') {
      isExiting.value = true
      setTimeout(() => {
        activeView.value = 'Overview'
        isExiting.value = false
      }, 300)
    }
    return
  }

  activeView.value = view
  isEntering.value = true
  setTimeout(() => {
    isEntering.value = false
  }, 300)

  menuVisible.value = false
}

// Close modal (reset to overview)
function closeModal() {
  isExiting.value = true
  setTimeout(() => {
    activeView.value = 'Overview'
    isExiting.value = false
  }, 300)
}

// Dynamic component switcher
const activeComponent = computed(() => {
  switch (activeView.value) {
    case 'Jobs':
      return DashboardJobs
    case 'Applicants':
      return ApplicantList
    case 'Notifications':
      return DashboardNotifications
    case 'CompanyProfile':
      return CompanyProfile
    case 'Settings':
      return UserSettings
    default:
      return null
  }
})
</script>

<style lang="scss" scoped>
/* Add global styles to prevent scrollbars */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

/* Navigation Bar - Matching MainLayout Header */
.user-dashboard-nav {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  height: 70px;
  border-bottom: 2px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: relative;
  z-index: 100;
}

/* Dashboard Icon Buttons - Matching MainLayout */
.nav-icon-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #495057;
  font-size: 0.75rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  min-width: 65px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    opacity: 0;
    transition: opacity 0.25s;
  }

  &:hover {
    color: #212529;
    transform: translateY(-2px);

    &::before {
      opacity: 1;
    }

    .q-icon {
      transform: scale(1.1);
    }
  }

  .q-icon {
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }

  .label {
    margin-top: 0.375rem;
    font-weight: 600;
    text-align: center;
    line-height: 1;
    z-index: 1;
  }
}

/* Avatar Button - Matching MainLayout */
.avatar-btn {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  padding: 0.25rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.user-avatar {
  border: 2px solid #e9ecef;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #212529;
  }

  img {
    object-fit: cover;
  }
}

/* Enhanced Dropdown Menu Styling - Matching MainLayout */
.user-menu {
  border-radius: 0.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  border: 1px solid #e9ecef;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.menu-list {
  min-width: 200px;
  background: transparent;
  padding: 0.5rem 0;
}

.menu-header {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  padding: 0.75rem 1rem 0.5rem;
  margin: 0;
}

.menu-item {
  padding: 0.875rem 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: #212529;
    transform: scaleY(0);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    color: #212529;

    &::before {
      transform: scaleY(1);
    }

    .menu-icon {
      transform: scale(1.1);
      color: #212529;
    }
  }

  &:active {
    background-color: #e9ecef;
  }

  &.logout-item {
    &:hover {
      background: linear-gradient(135deg, #f8d7da, #f5c6cb);
      color: #721c24;

      &::before {
        background: #dc3545;
      }

      .logout-icon {
        color: #dc3545;
      }
    }
  }
}

.menu-icon-section {
  min-width: 36px;
}

.menu-icon {
  color: #6c757d;
  font-size: 1.25rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-text {
  font-weight: 500;
  color: #495057;
  font-size: 0.875rem;
}

.menu-separator {
  background: #e9ecef;
  margin: 0.5rem 0;
}

.logout-icon {
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dashboard Content - Now Visible for Home */
.dashboard-content {
  flex: 1;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 2rem;
  height: calc(100vh - 70px);
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Modal Overlay - Full Screen with Blur */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999; /* Ensure it's above navbar */
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;


  &.modal-entering {
    animation: fadeInOverlay 0.3s ease-out forwards;
  }

  &.modal-exiting {
    animation: fadeOutOverlay 0.3s ease-out forwards;
  }
}

/* Modal Window - Responsive and Properly Sized */
.modal-window {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 1rem;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
  border: 1px solid #e9ecef;
  width: 100%;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transform: scale(0.8) translateY(50px);
  opacity: 0;
  animation: slideInWindow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  display: flex;
  flex-direction: column;

  &.window-entering {
    animation: slideInWindow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  &.window-exiting {
    animation: slideOutWindow 0.3s ease-in forwards;
  }
}

/* Modal Header - Fixed at Top */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  flex-shrink: 0;
  min-height: 60px;
}

.modal-title {
  margin: 0;
  color: #212529;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}

.close-btn {
  color: #6c757d;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  padding: 0.5rem;
  min-width: 40px;
  min-height: 40px;

  &:hover {
    color: #212529;
    background: rgba(33, 37, 41, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* Modal Content - Scrollable */
.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  flex: 1;
  min-height: 0;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;
    transition: background 0.2s;

    &:hover {
      background: #adb5bd;
    }
  }
}

/* Animations */
@keyframes fadeInOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOutOverlay {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideInWindow {
  from {
    transform: scale(0.8) translateY(50px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes slideOutWindow {
  from {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  to {
    transform: scale(0.9) translateY(-30px);
    opacity: 0;
  }
}

/* Enhanced Responsive Design */
@media (max-width: 768px) {
  .user-dashboard-nav {
    padding: 0 1rem;
    height: 64px;
  }

  .nav-icon-btn {
    min-width: 55px;
    padding: 0.5rem 0.375rem;
    font-size: 0.6875rem;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .menu-list {
    min-width: 180px;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-window {
    max-width: 95vw;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1rem;
    min-height: 50px;
  }

  .modal-title {
    font-size: 1.125rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .dashboard-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .user-dashboard-nav {
    height: 60px;
    padding: 0 0.5rem;
  }

  .nav-icon-btn {
    min-width: 50px;
    padding: 0.375rem 0.25rem;

    .label {
      font-size: 0.625rem;
    }
  }

  .modal-overlay {
    padding: 0.25rem;
  }

  .modal-window {
    max-width: 98vw;
    max-height: 98vh;
    border-radius: 0.5rem;
  }

  .modal-header {
    padding: 0.75rem;
    min-height: 45px;
  }

  .modal-title {
    font-size: 1rem;
  }

  .modal-content {
    padding: 0.75rem;
  }

  .dashboard-content {
    padding: 0.75rem;
  }

  .close-btn {
    padding: 0.375rem;
    min-width: 36px;
    min-height: 36px;
  }
}

/* Extra small screens */
@media (max-width: 320px) {
  .modal-window {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-overlay {
    padding: 0;
  }
}

/* Loading and Focus States */
.nav-icon-btn:focus-visible,
.avatar-btn:focus-visible,
.close-btn:focus-visible {
  outline: 2px solid #212529;
  outline-offset: 2px;
}

/* Subtle animations for professional feel */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-item {
  animation: fadeInUp 0.2s ease-out;
}

.menu-item:nth-child(1) { animation-delay: 0.05s; }
.menu-item:nth-child(2) { animation-delay: 0.1s; }
.menu-item:nth-child(3) { animation-delay: 0.15s; }
.menu-item:nth-child(4) { animation-delay: 0.2s; }
.menu-item:nth-child(5) { animation-delay: 0.25s; }

/* Prevent body scroll when modal is open */
body:has(.modal-overlay[style*="display: block"]) {
  overflow: hidden;
}
</style>

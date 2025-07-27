<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="header flex items-center justify-between q-px-md">
      <!-- LEFT: Logo -->
      <div class="flex items-center">
        <div class="logo text-bold text-h6"></div>
      </div>

      <!-- RIGHT: Navigation -->
      <div class="flex items-center q-gutter-md">
        <!-- User Dashboard -->
        <template v-if="isUserDashboard">
          <div class="nav-icon-btn" @click="goTo('/userdashboard')">
            <q-icon name="dashboard" size="24px" />
            <div class="label">Home</div>
          </div>

          <div class="nav-icon-btn" @click="goTo('/userdashboard/jobs')">
            <q-icon name="work" size="24px" />
            <div class="label">Jobs</div>
          </div>

          <div class="nav-icon-btn" @click="goTo('/userdashboard/notifications')">
            <q-icon name="notifications" size="24px" />
            <div class="label">Notifications</div>
          </div>

          <div class="nav-icon-btn" @click="goTo('/userdashboard/applications')">
            <q-icon name="assignment" size="24px" />
            <div class="label">Tracker</div>
          </div>

          <div class="nav-icon-btn" @click="goTo('/userdashboard/matching-companies')">
            <q-icon name="business" size="24px" />
            <div class="label">Companies</div>
          </div>

          <!-- Avatar Dropdown -->
          <q-btn round flat dense class="avatar-btn">
            <q-avatar size="36px" class="user-avatar">
              <img src="https://cdn.quasar.dev/img/avatar.png" alt="User Avatar" />
            </q-avatar>
            <q-menu class="user-menu">
              <q-list class="menu-list">
                <q-item-label header class="menu-header">Account</q-item-label>

                <q-item clickable v-ripple @click="goTo('/userdashboard/profile')" class="menu-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="person" class="menu-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Profile</q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="goTo('/userdashboard/settings')" class="menu-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="settings" class="menu-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Settings</q-item-section>
                </q-item>

                <q-separator class="menu-separator" />

                <q-item clickable v-ripple @click="logout" class="menu-item logout-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="logout" class="menu-icon logout-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>

        <!-- Recruiter Dashboard -->
        <template v-else-if="isRecruiterDashboard">
          <div class="nav-icon-btn" @click="goTo('/recruiterdashboard')">
            <q-icon name="dashboard" size="24px" />
            <div class="label">Home</div>
          </div>

          <div class="nav-icon-btn" @click="goTo('/recruiterdashboard/post-job')">
            <q-icon name="add_box" size="24px" />
            <div class="label">Post</div>
          </div>

          <div class="nav-icon-btn" @click="goTo('/recruiterdashboard/notifications')">
            <q-icon name="notifications" size="24px" />
            <div class="label">Notifications</div>
          </div>

          <!-- Avatar Dropdown -->
          <q-btn round flat dense class="avatar-btn">
            <q-avatar size="36px" class="user-avatar">
              <img src="https://cdn.quasar.dev/img/avatar.png" alt="Recruiter Avatar" />
            </q-avatar>

            <q-menu class="user-menu">
              <q-list class="menu-list">
                <q-item-label header class="menu-header">Management</q-item-label>

                <q-item clickable v-ripple @click="goTo('/recruiterdashboard/jobs')" class="menu-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="work_outline" class="menu-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Posted Jobs</q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="goTo('/recruiterdashboard/applications')" class="menu-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="assignment_ind" class="menu-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Applications Recieved</q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="goTo('/recruiterdashboard/hired')" class="menu-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="check_circle_outline" class="menu-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Hired</q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="goTo('/recruiterdashboard/profile')" class="menu-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="person" class="menu-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Profile</q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="goTo('/recruiterdashboard/settings')" class="menu-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="settings" class="menu-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Settings</q-item-section>
                </q-item>

                <q-separator class="menu-separator" />

                <q-item clickable v-ripple @click="logout" class="menu-item logout-item">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon name="logout" class="menu-icon logout-icon" />
                  </q-item-section>
                  <q-item-section class="menu-text">Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>

        <!-- Landing Page: Log In & Sign Up -->
        <template v-else-if="isLandingPage">
          <q-btn label="Log In" flat class="btn login-btn" to="/login" />
          <q-btn label="Sign Up" flat class="btn signup-btn" to="/register" />
        </template>

        <!-- Auth Pages: Back Button -->
        <q-btn
          v-else-if="isAuthPage"
          label="Back"
          flat
          icon="arrow_back"
          class="btn back-btn"
          @click="router.back()"
        />
      </div>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const isLandingPage = computed(() => route.path === '/')
const isAuthPage = computed(() => ['/login', '/register'].includes(route.path))
const isUserDashboard = computed(() => route.path.startsWith('/userdashboard'))
const isRecruiterDashboard = computed(() => route.path.startsWith('/recruiterdashboard'))

function logout () {
  console.log('User logged out')
  router.push('/')
}

function goTo (path) {
  router.push(path)
}
</script>



<style lang="scss" scoped>
/* Header */
.header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  height: 70px;
  border-bottom: 2px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.logo {
  color: #212529;
  font-weight: 800;
  letter-spacing: -0.025em;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #212529, #495057);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
}

/* Button Base */
.btn {
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0.375rem; /* rounded-md */
  padding: 0.75rem 1.5rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
    transition: transform 0.1s;
  }
}

/* Login */
.login-btn {
  background-color: #ffffff;
  color: #212529;
  border-color: #212529;

  &:hover {
    background-color: #f8f9fa;
    border-color: #000000;
    color: #000000;
    box-shadow: 0 8px 25px rgba(33, 37, 41, 0.15);
  }

  &:active {
    background-color: #e9ecef;
  }
}

/* Sign Up */
.signup-btn {
  background-color: #212529;
  color: #ffffff;

  &:hover {
    background-color: #000000;
    box-shadow: 0 8px 25px rgba(33, 37, 41, 0.25);
  }

  &:active {
    background-color: #343a40;
  }
}

/* Back Button */
.back-btn {
  background-color: #ffffff;
  color: #212529;
  border-color: #212529;

  &:hover {
    background-color: #212529;
    color: #ffffff;
    box-shadow: 0 8px 25px rgba(33, 37, 41, 0.15);
  }

  &:active {
    background-color: #000000;
  }
}

/* Dashboard Icon Buttons */
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

/* Avatar Button */
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

/* Enhanced Dropdown Menu Styling */
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

/* Enhanced Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 0 1rem;
    height: 64px;
  }

  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.8rem;
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
}

@media (max-width: 480px) {
  .header {
    height: 60px;
  }

  .nav-icon-btn {
    min-width: 50px;
    padding: 0.375rem 0.25rem;

    .label {
      font-size: 0.625rem;
    }
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}

/* Loading and Focus States */
.nav-icon-btn:focus-visible,
.btn:focus-visible,
.avatar-btn:focus-visible {
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
</style>

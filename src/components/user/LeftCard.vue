<template>
  <div class="profile-container">
    <!-- Toggle Button (always visible) -->

    <!-- Profile Card -->
    <transition enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
      <q-card v-show="isCardVisible" class="modern-profile-card full-width" flat bordered>
        <!-- Header with gradient -->
        <div class="card-header q-pa-sm text-white relative-position">
          <!-- Close X Button -->
          <q-btn
            icon="close"
            round
            flat
            size="sm"
            color="grey-6"
            class="close-btn"
            @click="toggleCard"
          >
            <q-tooltip :delay="500">Close Profile</q-tooltip>
          </q-btn>

          <div class="profile-header">
            <div class="profile-avatar-container">
              <div class="initials-avatar" :style="{ width: avatarSize, height: avatarSize }">
                <span class="initials-text">{{ userInitials }}</span>
              </div>
            </div>

            <div class="profile-info">
              <div class="user-name text-weight-medium q-mb-xs">Welcome {{ firstName }}</div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <q-card-section class="contact-section">
          <div class="contact-list">
            <!-- Email -->
            <div class="contact-item email-item">
              <div class="contact-icon-wrapper">
                <q-icon name="email" :size="iconSize" color="grey-6" />
              </div>
              <div class="contact-details email-details">
                <div class="contact-value email-value">{{ user.email }}</div>
              </div>
            </div>

            <!-- Phone -->
            <div class="contact-item">
              <div class="contact-icon-wrapper">
                <q-icon name="phone" :size="iconSize" color="grey-6" />
              </div>
              <div class="contact-details">
                <div class="contact-value">{{ user.phone }}</div>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Footer -->
        <q-separator />
        <q-card-section class="footer-section">
          <div class="status-row">
            <div class="status-info">
              <span class="status-text text-weight-medium">
                {{ user.status }}
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </transition>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'

// Define emits
const emit = defineEmits(['toggle-visibility'])

const $q = useQuasar()

// Card visibility state
const isCardVisible = ref(true)

const user = reactive({
  name: useUserStore().name,
  phone: useUserStore().phone,
  email: useUserStore().email,
  status: useUserStore().role,
})

// Toggle card visibility and emit event to parent
const toggleCard = () => {
  isCardVisible.value = !isCardVisible.value
  emit('toggle-visibility', isCardVisible.value)
}

// Get first name and initials
const firstName = computed(() => {
  return user.name.split(' ')[0]
})

const userInitials = computed(() => {
  const names = user.name.split(' ')
  if (names.length >= 2) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
  }
  return names[0].charAt(0).toUpperCase()
})

// Responsive sizing - reduced sizes
const avatarSize = computed(() => {
  if ($q.screen.xs) return '60px'
  if ($q.screen.sm) return '70px'
  return '80px'
})

const iconSize = computed(() => {
  if ($q.screen.xs) return '16px'
  return '18px'
})
</script>

<style scoped>
.profile-container {
  position: relative;
  height: 100%;
}

.toggle-btn {
  position: fixed;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  z-index: 1000;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.toggle-btn-hidden {
  left: 10px !important;
  background: #1976d2 !important;
  color: white !important;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #666;
  transform: scale(1.1);
}

.modern-profile-card {
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  border: 1px solid #e9ecef !important;
  position: relative;
  height: fit-content;
  margin-left: 60px; /* Space for toggle button */
}

.modern-profile-card:hover {
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04) !important;
  transform: translateY(-4px);
  border-color: #dee2e6 !important;
}

.card-header {
  background: #ffffff;
  position: relative;
  padding: 32px 24px 24px 24px !important;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.profile-avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.initials-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6c757d;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 3px solid #ffffff;
  position: relative;
}

.initials-text {
  color: white;
  font-weight: 700;
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 1px;
}

.profile-info {
  width: 100%;
}

.user-name {
  font-size: clamp(1.1rem, 3.5vw, 1.3rem);
  line-height: 1.3;
  word-break: break-word;
  color: #000000;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.5px;
}

.contact-section {
  padding: 24px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 16px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  gap: 16px;
  background: #f8f9fa;
}

.contact-item:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  transform: translateY(-1px);
}

/* Special styling for email item to take full width */
.email-item {
  display: block; /* Change from flex to block */
}

.email-item .contact-icon-wrapper {
  float: left;
  margin-right: 16px;
  margin-bottom: 8px;
}

.email-details {
  overflow: hidden; /* This will make it take remaining space */
}

.email-value {
  width: 100%;
  word-break: break-all;
  overflow-wrap: break-word;
  hyphens: auto;
}

.contact-icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.contact-details {
  flex: 1;
  min-width: 0;
}

.contact-value {
  font-size: 14px;
  color: #000000;
  word-break: break-all;
  line-height: 1.4;
  font-weight: 500;
}

.footer-section {
  padding: 20px 24px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6c757d;
}

.status-info {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.status-text {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000000;
}

/* Animation classes */
.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fadeInLeft {
  animation-name: fadeInLeft;
}

.fadeOutLeft {
  animation-name: fadeOutLeft;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOutLeft {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
}

/* Desktop and larger screens */
@media (min-width: 1024px) {
  .modern-profile-card {
    height: 85vh;
    display: flex;
    flex-direction: column;
  }

  .contact-section {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .contact-list {
    flex: 1;
    justify-content: flex-start;
  }

  .toggle-btn {
    left: 20px;
  }
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .modern-profile-card {
    height: fit-content;
    margin-left: 50px;
  }

  .contact-section {
    padding: 20px;
  }

  .card-header {
    padding: 24px 20px 20px 20px !important;
  }

  .contact-value {
    font-size: 13px;
  }

  .user-name {
    font-size: 1.1rem;
  }

  .toggle-btn {
    left: 15px;
  }

  .close-btn {
    top: 10px;
    right: 10px;
  }
}

/* Mobile specific adjustments */
@media (max-width: 767px) {
  .modern-profile-card {
    height: fit-content !important;
    border-radius: 20px !important;
    margin-left: 45px;
  }

  .profile-header {
    gap: 12px;
  }

  .contact-section {
    padding: 20px 16px;
  }

  .card-header {
    padding: 24px 16px 20px 16px !important;
  }

  .contact-item {
    padding: 16px;
    gap: 12px;
  }

  .contact-icon-wrapper {
    width: 36px;
    height: 36px;
  }

  .contact-value {
    font-size: 13px;
  }

  .footer-section {
    padding: 16px;
  }

  .status-info {
    padding: 6px 12px;
  }

  .initials-avatar {
    border-radius: 12px;
  }

  .toggle-btn {
    left: 8px;
  }

  .close-btn {
    top: 8px;
    right: 8px;
  }
}

/* Extra small mobile devices */
@media (max-width: 480px) {
  .modern-profile-card {
    border-radius: 16px !important;
    margin-left: 40px;
  }

  .contact-section {
    padding: 16px 12px;
  }

  .card-header {
    padding: 20px 12px 16px 12px !important;
  }

  .contact-item {
    padding: 10px;
    gap: 10px;
  }

  .contact-icon-wrapper {
    width: 32px;
    height: 32px;
  }

  .user-name {
    font-size: 1rem;
  }

  .initials-avatar {
    border-radius: 10px;
  }

  .toggle-btn {
    left: 5px;
  }

  .close-btn {
    top: 6px;
    right: 6px;
  }
}
</style>

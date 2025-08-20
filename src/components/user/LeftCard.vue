<template>
  <q-card class="modern-profile-card full-width" flat bordered>
    <!-- Header with gradient -->
    <div class="card-header q-pa-sm text-white relative-position">
      <div class="absolute-top-right q-pa-sm"></div>

      <div class="profile-header">
        <div class="profile-avatar-container">
          <q-avatar :size="avatarSize" class="profile-avatar">
            <img :src="user.profilePhoto" :alt="user.name" />
          </q-avatar>
          <q-badge :color="statusColor" rounded class="status-badge" />
        </div>

        <div class="profile-info">
          <div class="user-name text-weight-medium q-mb-xs">{{ user.name }}</div>
          <q-chip
            :color="planColor"
            :icon="planIcon"
            text-color="white"
            class="text-weight-medium plan-chip"
            :size="chipSize"
          >
            {{ user.plan.toUpperCase() }}
          </q-chip>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <q-card-section class="contact-section">
      <div class="section-title text-weight-medium q-mb-sm">Contact Information</div>

      <div class="contact-list">
        <!-- Email -->
        <div class="contact-item">
          <div class="contact-icon-wrapper">
            <q-icon name="email" :size="iconSize" color="grey-6" />
          </div>
          <div class="contact-details">
            <div class="contact-label text-weight-medium">Email</div>
            <div class="contact-value">{{ user.email }}</div>
          </div>
          <q-btn
            flat
            round
            icon="content_copy"
            size="sm"
            color="grey-6"
            @click="copyToClipboard(user.email, 'Email')"
            class="copy-btn"
          >
            <q-tooltip class="bg-grey-8">Copy</q-tooltip>
          </q-btn>
        </div>

        <!-- Phone -->
        <div class="contact-item">
          <div class="contact-icon-wrapper">
            <q-icon name="phone" :size="iconSize" color="grey-6" />
          </div>
          <div class="contact-details">
            <div class="contact-label text-weight-medium">Phone</div>
            <div class="contact-value">{{ user.phone }}</div>
          </div>
          <q-btn
            flat
            round
            icon="content_copy"
            size="sm"
            color="grey-6"
            @click="copyToClipboard(user.phone, 'Phone')"
            class="copy-btn"
          >
            <q-tooltip class="bg-grey-8">Copy</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <!-- Footer -->
    <q-separator />
    <q-card-section class="footer-section">
      <div class="status-row">
        <div class="status-info">
          <q-icon name="circle" :color="statusColor" size="8px" />
          <span class="status-text text-weight-medium">
            {{ user.status }}
          </span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import ApplicantPng from '../../assets/applicant.png'
import RecruiterPng from '../../assets/recruiter.png'

const $q = useQuasar()

const user = reactive({
  name: useUserStore().name,
  phone: useUserStore().phone,
  email: useUserStore().email,
  plan: 'Welcome',
  profilePhoto: useUserStore().role == 'applicant' ? ApplicantPng : RecruiterPng,
  status: useUserStore().role,
})

// Responsive sizing - reduced sizes
const avatarSize = computed(() => {
  if ($q.screen.xs) return '50px'
  if ($q.screen.sm) return '55px'
  return '60px'
})

const iconSize = computed(() => {
  if ($q.screen.xs) return '16px'
  return '18px'
})

const chipSize = computed(() => {
  return 'xs'
})

const planColor = computed(() => {
  return user.plan === 'premium' ? 'black' : 'grey-6'
})

const planIcon = computed(() => {
  return user.plan === 'premium' ? 'stars' : 'person'
})

const statusColor = computed(() => {
  return 'positive'
})

const copyToClipboard = (text, type) => {
  navigator.clipboard.writeText(text).then(() => {
    $q.notify({
      type: 'info',
      message: `${type} copied`,
      position: 'bottom',
      timeout: 1500,
    })
  })
}
</script>

<style scoped>
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

  /* Desktop: 85vh height, Mobile: fit-content */
  height: fit-content;
}

.modern-profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #000000 0%, #333333 50%, #000000 100%);
  z-index: 1;
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
  margin-top: 4px; /* Account for the accent line */
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

.profile-avatar {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 3px solid #ffffff;
}

.status-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px !important;
  height: 16px !important;
  border: 3px solid white;
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

.plan-chip {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 12px;
  padding: 8px 16px;
}

.contact-section {
  padding: 24px;
}

.section-title {
  font-size: 14px;
  color: #000000;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 16px;
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

.contact-label {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  font-size: 14px;
  color: #000000;
  word-break: break-all;
  line-height: 1.4;
  font-weight: 500;
}

.copy-btn {
  opacity: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
  background: #ffffff;
  border: 1px solid #e9ecef;
}

.copy-btn:hover {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.contact-item:hover .copy-btn {
  opacity: 1;
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
  gap: 8px;
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

/* Desktop and larger screens - 85vh height */
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
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .modern-profile-card {
    height: fit-content;
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
}

/* Mobile specific adjustments - fit-content */
@media (max-width: 767px) {
  .modern-profile-card {
    height: fit-content !important;
    border-radius: 20px !important;
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
    padding: 12px;
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
}

/* Extra small mobile devices */
@media (max-width: 480px) {
  .modern-profile-card {
    border-radius: 16px !important;
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
}
</style>
